import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@shared/components/layout/Header'
import { Footer } from '@shared/components/layout/Footer'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@shared/components/ui/card'
import { Button } from '@shared/components/ui/button'
import { Badge } from '@shared/components/ui/badge'
import { Input } from '@shared/components/ui/input'
import { Label } from '@shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@shared/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@shared/components/ui/alert-dialog'
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/hooks/useAddresses'
import { LoadingSpinner } from '@shared/components/ui/loading'
import { ErrorMessage } from '@shared/components/ui/error-boundary'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  MapPin,
  Edit,
  Trash2,
  Star,
  Phone,
} from 'lucide-react'
import type { Address } from '@/types'

export default function AddressManagementPage() {
  const navigate = useNavigate()
  const { data: addresses, isLoading, error, refetch } = useAddresses()
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()
  const deleteAddress = useDeleteAddress()
  const setDefaultAddress = useSetDefaultAddress()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [deleteAddressId, setDeleteAddressId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    street: '',
    city: '',
    state: '',
    district: '',
    ward: '',
    zipCode: '',
    country: 'Việt Nam',
    isDefault: false,
  })

  const resetForm = () => {
    setFormData({
      recipientName: '',
      recipientPhone: '',
      street: '',
      city: '',
      state: '',
      district: '',
      ward: '',
      zipCode: '',
      country: 'Việt Nam',
      isDefault: false,
    })
    setSelectedAddress(null)
  }

  const handleOpenAddDialog = () => {
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleOpenEditDialog = (address: Address) => {
    setSelectedAddress(address)
    setFormData({
      recipientName: address.recipientName || '',
      recipientPhone: address.recipientPhone || '',
      street: address.street,
      city: address.city,
      state: address.state,
      district: address.district || '',
      ward: address.ward || '',
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteAddressId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.recipientName ||
      !formData.recipientPhone ||
      !formData.street ||
      !formData.city ||
      !formData.state
    ) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    try {
      if (selectedAddress) {
        await updateAddress.mutateAsync({
          id: selectedAddress.id,
          data: formData,
        })
        toast.success('Cập nhật địa chỉ thành công')
        setIsEditDialogOpen(false)
      } else {
        await createAddress.mutateAsync(formData as Omit<Address, 'id'>)
        toast.success('Thêm địa chỉ thành công')
        setIsAddDialogOpen(false)
      }
      resetForm()
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleDelete = async () => {
    if (!deleteAddressId) return

    try {
      await deleteAddress.mutateAsync(deleteAddressId)
      toast.success('Xóa địa chỉ thành công')
      setIsDeleteDialogOpen(false)
      setDeleteAddressId(null)
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress.mutateAsync(id)
      toast.success('Đã đặt làm địa chỉ mặc định')
    } catch {
      toast.error('Có lỗi xảy ra')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage error={error} onRetry={() => refetch()} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Quản lý địa chỉ</h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý địa chỉ giao hàng của bạn
                </p>
              </div>
            </div>
            <Button onClick={handleOpenAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm địa chỉ
            </Button>
          </div>

          {/* Addresses List */}
          {addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <Card
                  key={address.id}
                  className="relative hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {address.isDefault ? (
                            <div className="flex items-center gap-2">
                              <span>Địa chỉ mặc định</span>
                              <Badge className="bg-primary text-primary-foreground">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Mặc định
                              </Badge>
                            </div>
                          ) : (
                            'Địa chỉ giao hàng'
                          )}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-base">
                        {address.recipientName}
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{address.recipientPhone}</span>
                      </div>
                      <p className="font-medium mt-2">{address.street}</p>
                      <p className="text-muted-foreground">
                        {address.ward && `${address.ward}, `}
                        {address.district && `${address.district}, `}
                        {address.state}, {address.city}
                      </p>
                      <p className="text-muted-foreground">
                        {address.zipCode} - {address.country}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                          className="flex-1"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Đặt mặc định
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditDialog(address)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Sửa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(address.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Chưa có địa chỉ nào
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thêm địa chỉ để có thể nhận hàng nhanh chóng
                </p>
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm địa chỉ đầu tiên
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Add Address Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm địa chỉ mới</DialogTitle>
                <DialogDescription>
                  Thêm địa chỉ giao hàng mới để nhận hàng nhanh chóng
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Tên người nhận *</Label>
                      <Input
                        id="recipientName"
                        placeholder="Họ và tên"
                        value={formData.recipientName}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            recipientName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone">Số điện thoại *</Label>
                      <Input
                        id="recipientPhone"
                        placeholder="0901234567"
                        value={formData.recipientPhone}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            recipientPhone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="street">Địa chỉ chi tiết *</Label>
                    <Input
                      id="street"
                      placeholder="Số nhà, tên đường"
                      value={formData.street}
                      onChange={e =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ward">Phường/Xã</Label>
                      <Input
                        id="ward"
                        placeholder="Ví dụ: Phường Bến Nghé"
                        value={formData.ward}
                        onChange={e =>
                          setFormData({ ...formData, ward: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">Quận/Huyện *</Label>
                      <Input
                        id="district"
                        placeholder="Ví dụ: Quận 1"
                        value={formData.district}
                        onChange={e =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="city"
                        placeholder="Ví dụ: Hồ Chí Minh"
                        value={formData.city}
                        onChange={e =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Tỉnh/Thành phố (cũ) *</Label>
                      <Input
                        id="state"
                        placeholder="Ví dụ: TP.HCM"
                        value={formData.state}
                        onChange={e =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Mã bưu điện</Label>
                      <Input
                        id="zipCode"
                        placeholder="700000"
                        value={formData.zipCode}
                        onChange={e =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={e =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label
                      htmlFor="isDefault"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={createAddress.isPending}>
                    {createAddress.isPending ? 'Đang thêm...' : 'Thêm địa chỉ'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Address Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Sửa địa chỉ</DialogTitle>
                <DialogDescription>
                  Cập nhật thông tin địa chỉ giao hàng
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-recipientName">
                        Tên người nhận *
                      </Label>
                      <Input
                        id="edit-recipientName"
                        placeholder="Họ và tên"
                        value={formData.recipientName}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            recipientName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-recipientPhone">
                        Số điện thoại *
                      </Label>
                      <Input
                        id="edit-recipientPhone"
                        placeholder="0901234567"
                        value={formData.recipientPhone}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            recipientPhone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-street">Địa chỉ chi tiết *</Label>
                    <Input
                      id="edit-street"
                      placeholder="Số nhà, tên đường"
                      value={formData.street}
                      onChange={e =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-ward">Phường/Xã</Label>
                      <Input
                        id="edit-ward"
                        placeholder="Ví dụ: Phường Bến Nghé"
                        value={formData.ward}
                        onChange={e =>
                          setFormData({ ...formData, ward: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-district">Quận/Huyện *</Label>
                      <Input
                        id="edit-district"
                        placeholder="Ví dụ: Quận 1"
                        value={formData.district}
                        onChange={e =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-city">Tỉnh/Thành phố *</Label>
                      <Input
                        id="edit-city"
                        placeholder="Ví dụ: Hồ Chí Minh"
                        value={formData.city}
                        onChange={e =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-state">Tỉnh/Thành phố (cũ) *</Label>
                      <Input
                        id="edit-state"
                        placeholder="Ví dụ: TP.HCM"
                        value={formData.state}
                        onChange={e =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-zipCode">Mã bưu điện</Label>
                      <Input
                        id="edit-zipCode"
                        placeholder="700000"
                        value={formData.zipCode}
                        onChange={e =>
                          setFormData({ ...formData, zipCode: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-country">Quốc gia</Label>
                      <Input
                        id="edit-country"
                        value={formData.country}
                        onChange={e =>
                          setFormData({ ...formData, country: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-isDefault"
                      checked={formData.isDefault}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label
                      htmlFor="edit-isDefault"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Đặt làm địa chỉ mặc định
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={updateAddress.isPending}>
                    {updateAddress.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể
                  hoàn tác.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  )
}
