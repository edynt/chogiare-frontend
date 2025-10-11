import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/hooks/useAuth'
import { User, Mail, Phone, MapPin } from 'lucide-react'

export function ProfileContent() {
  const { data: profile, isLoading } = useProfile()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{profile.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Việt Nam</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Họ và tên</label>
              <Input value={profile.name} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input value={profile.email} disabled />
            </div>
            <div>
              <label className="text-sm font-medium">Số điện thoại</label>
              <Input value={profile.phone || ''} disabled />
            </div>
            <Button>Chỉnh sửa thông tin</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Số bài đăng:</span>
              <span className="font-medium">{profile.postCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Vai trò:</span>
              <span className="font-medium">{profile.roles.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Ngày tham gia:</span>
              <span className="font-medium">
                {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {profile.storeInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cửa hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tên cửa hàng</label>
                <Input value={profile.storeInfo.name} disabled />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Input value={profile.storeInfo.description || ''} disabled />
              </div>
              <div className="flex justify-between">
                <span>Đánh giá:</span>
                <span className="font-medium">
                  ⭐ {profile.storeInfo.rating} ({profile.storeInfo.reviewCount} đánh giá)
                </span>
              </div>
              <Button>Chỉnh sửa cửa hàng</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
