import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/components/ui/select'
import { useUpdateUser } from '@/hooks/useAdmin'
import { toast } from 'sonner'
import { getApiErrorMessage } from '@/lib/utils'
import type { AdminUser, UpdateUserDto } from '@admin/api/admin'
import { Loader2 } from 'lucide-react'

interface EditUserDialogProps {
  user: AdminUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
}: EditUserDialogProps) {
  const updateUserMutation = useUpdateUser()

  // Form state
  const [formData, setFormData] = useState<UpdateUserDto>({
    fullName: '',
    phoneNumber: '',
    address: '',
    gender: '',
    dateOfBirth: '',
    country: '',
  })

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.userInfo?.fullName || user.name || '',
        phoneNumber: user.userInfo?.phoneNumber || user.phone || '',
        address: user.userInfo?.address || user.location || '',
        gender: user.userInfo?.gender || '',
        dateOfBirth: user.userInfo?.dateOfBirth || '',
        country: user.userInfo?.country || '',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: formData,
      })
      toast.success('Đã cập nhật thông tin người dùng thành công')
      onOpenChange(false)
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể cập nhật thông tin'))
    }
  }

  const handleChange = (field: keyof UpdateUserDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân của người dùng. Nhấn lưu để hoàn tất.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Full Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Họ và tên
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
                className="col-span-3"
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={e => handleChange('phoneNumber', e.target.value)}
                className="col-span-3"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Địa chỉ
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => handleChange('address', e.target.value)}
                className="col-span-3"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Gender */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">
                Giới tính
              </Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleChange('gender', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date of Birth */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right">
                Ngày sinh
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={e => handleChange('dateOfBirth', e.target.value)}
                className="col-span-3"
              />
            </div>

            {/* Country */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Quốc gia
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={e => handleChange('country', e.target.value)}
                className="col-span-3"
                placeholder="Nhập quốc gia"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateUserMutation.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateUserMutation.isPending}>
              {updateUserMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
