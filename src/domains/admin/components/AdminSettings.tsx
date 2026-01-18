import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import { Switch } from '@shared/components/ui/switch'
import { Textarea } from '@shared/components/ui/textarea'
import { APP_NAME } from '@/constants/app.constants'
import {
  Settings,
  Save,
  Shield,
  Mail,
  Bell,
  Database,
  Server,
} from 'lucide-react'

export function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Cài đặt hệ thống</h2>
        <p className="text-muted-foreground">Cấu hình các thông số hệ thống</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Cài đặt chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site-name">Tên trang web</Label>
              <Input id="site-name" defaultValue={APP_NAME} />
            </div>
            <div>
              <Label htmlFor="site-description">Mô tả trang web</Label>
              <Textarea
                id="site-description"
                defaultValue="Nền tảng mua bán trực tuyến uy tín"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="admin-email">Email quản trị</Label>
              <Input
                id="admin-email"
                type="email"
                defaultValue="admin@chogiare.com"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="maintenance" />
              <Label htmlFor="maintenance">Chế độ bảo trì</Label>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="session-timeout">
                Thời gian hết phiên (phút)
              </Label>
              <Input id="session-timeout" type="number" defaultValue="30" />
            </div>
            <div>
              <Label htmlFor="max-login-attempts">
                Số lần đăng nhập tối đa
              </Label>
              <Input id="max-login-attempts" type="number" defaultValue="5" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="two-factor" />
              <Label htmlFor="two-factor">Xác thực 2 yếu tố</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="email-verification" />
              <Label htmlFor="email-verification">Xác thực email</Label>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Cài đặt email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" defaultValue="smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" type="number" defaultValue="587" />
            </div>
            <div>
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input id="smtp-username" defaultValue="noreply@chogiare.com" />
            </div>
            <div>
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input id="smtp-password" type="password" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" />
              <Label htmlFor="email-notifications">Thông báo email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="push-notifications" />
              <Label htmlFor="push-notifications">Thông báo đẩy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="order-notifications" />
              <Label htmlFor="order-notifications">Thông báo đơn hàng</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="user-notifications" />
              <Label htmlFor="user-notifications">Thông báo người dùng</Label>
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Cơ sở dữ liệu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" defaultValue="localhost" />
            </div>
            <div>
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" defaultValue="chogiare_db" />
            </div>
            <div>
              <Label htmlFor="backup-frequency">Tần suất sao lưu</Label>
              <Input id="backup-frequency" defaultValue="Daily" />
            </div>
            <Button variant="outline" className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Sao lưu ngay
            </Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              Thông tin hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Phiên bản:</span>
                <span className="ml-2 font-medium">v1.0.0</span>
              </div>
              <div>
                <span className="text-muted-foreground">Uptime:</span>
                <span className="ml-2 font-medium">99.9%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Bộ nhớ:</span>
                <span className="ml-2 font-medium">2.1GB / 8GB</span>
              </div>
              <div>
                <span className="text-muted-foreground">CPU:</span>
                <span className="ml-2 font-medium">45%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Server className="h-4 w-4 mr-2" />
              Kiểm tra hệ thống
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          <Save className="h-4 w-4 mr-2" />
          Lưu tất cả cài đặt
        </Button>
      </div>
    </div>
  )
}
