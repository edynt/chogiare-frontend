import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { ArrowLeft, Send, Save } from 'lucide-react'
import { useCreateNotification } from '@/hooks/useNotifications'
import type { CreateNotificationRequest } from '@/api/notifications'

export default function CreateNotificationPage() {
  const navigate = useNavigate()
  const createNotificationMutation = useCreateNotification()
  const [formData, setFormData] = useState<CreateNotificationRequest>({
    type: 'system',
    title: '',
    message: '',
    actionUrl: '',
    targetAllUsers: true,
    targetUserIds: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề thông báo')
      return
    }

    if (!formData.message.trim()) {
      toast.error('Vui lòng nhập nội dung thông báo')
      return
    }

    try {
      const payload: CreateNotificationRequest = {
        type: formData.type,
        title: formData.title.trim(),
        message: formData.message.trim(),
        targetAllUsers: formData.targetAllUsers,
      }

      if (formData.actionUrl?.trim()) {
        payload.actionUrl = formData.actionUrl.trim()
      }

      if (!formData.targetAllUsers && formData.targetUserIds && formData.targetUserIds.length > 0) {
        payload.targetUserIds = formData.targetUserIds
      }

      const result = await createNotificationMutation.mutateAsync(payload)
      
      toast.success(`Đã tạo thông báo thành công! Đã gửi cho ${result.sentCount} người dùng.`)
      navigate('/admin/notifications')
    } catch {
      toast.error('Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại.')
    }
  }

  const handleTargetChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      targetAllUsers: value === 'all',
      targetUserIds: value === 'all' ? [] : prev.targetUserIds,
    }))
  }

  const handleUserIdsChange = (value: string) => {
    const userIds = value
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id))
    
    setFormData(prev => ({
      ...prev,
      targetUserIds: userIds,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/notifications')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Tạo thông báo mới</h1>
        <p className="text-muted-foreground mt-2">
          Tạo và gửi thông báo đến người dùng trong hệ thống
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thông báo</CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản của thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Loại thông báo *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as CreateNotificationRequest['type'] }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">Hệ thống</SelectItem>
                    <SelectItem value="promotion">Khuyến mãi</SelectItem>
                    <SelectItem value="order">Đơn hàng</SelectItem>
                    <SelectItem value="product">Sản phẩm</SelectItem>
                    <SelectItem value="payment">Thanh toán</SelectItem>
                    <SelectItem value="message">Tin nhắn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề thông báo"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/200 ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung *</Label>
                <Textarea
                  id="message"
                  placeholder="Nhập nội dung thông báo"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.message.length}/1000 ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionUrl">URL hành động (tùy chọn)</Label>
                <Input
                  id="actionUrl"
                  type="url"
                  placeholder="https://example.com/action"
                  value={formData.actionUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, actionUrl: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  URL sẽ được mở khi người dùng click vào thông báo
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Đối tượng nhận thông báo</CardTitle>
              <CardDescription>
                Chọn người dùng sẽ nhận thông báo này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.targetAllUsers ? 'all' : 'specific'}
                onValueChange={handleTargetChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="font-normal cursor-pointer">
                    Tất cả người dùng
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="specific" id="specific" />
                  <Label htmlFor="specific" className="font-normal cursor-pointer">
                    Người dùng cụ thể
                  </Label>
                </div>
              </RadioGroup>

              {!formData.targetAllUsers && (
                <div className="space-y-2">
                  <Label htmlFor="userIds">Danh sách ID người dùng</Label>
                  <Input
                    id="userIds"
                    placeholder="1, 2, 3, 4, 5"
                    value={formData.targetUserIds?.join(', ') || ''}
                    onChange={(e) => handleUserIdsChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập danh sách ID người dùng, cách nhau bởi dấu phẩy (ví dụ: 1, 2, 3)
                  </p>
                  {formData.targetUserIds && formData.targetUserIds.length > 0 && (
                    <p className="text-xs text-green-600">
                      Sẽ gửi cho {formData.targetUserIds.length} người dùng
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/notifications')}
              disabled={createNotificationMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createNotificationMutation.isPending || !formData.title.trim() || !formData.message.trim()}
            >
              {createNotificationMutation.isPending ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Tạo và gửi thông báo
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

