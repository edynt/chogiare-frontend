import { describe, it, expect } from 'vitest'
import { adminApi, type BoostPackageResponse, type ServicePackage } from '../admin'

describe('Admin API - transformBoostPackage', () => {
  describe('BoostPackage to ServicePackage transformation', () => {
    it('should transform basic BoostPackage with payPerDay type', () => {
      const boostPackage: BoostPackageResponse = {
        id: '123abc456def',
        name: 'Test Package',
        type: 'payPerDay',
        price: '50000',
        description: 'Test description',
        config: {
          durationDays: 7,
          priority: 1,
          maxProducts: 5,
        },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result).toBeDefined()
      expect(result.name).toBe('Test Package')
      expect(result.price).toBe(50000)
      expect(result.duration).toBe('7 ngày')
      expect(result.features).toBeInstanceOf(Array)
      expect(result.features.length).toBeGreaterThan(0)
      expect(result.limitations).toBeInstanceOf(Array)
      expect(result.limitations.length).toBeGreaterThan(0)
      expect(result.isActive).toBe(true)
    })

    it('should transform BoostPackage with payPerView type', () => {
      const boostPackage: BoostPackageResponse = {
        id: '789ghi012jkl',
        name: 'View Boost Package',
        type: 'payPerView',
        price: 25000,
        description: 'Per view package',
        config: {
          viewLimit: 1000,
          validityDays: 30,
          maxProductsPerBoost: 10,
        },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.name).toBe('View Boost Package')
      expect(result.price).toBe(25000)
      expect(result.duration).toBe('30 ngày')
      expect(result.features).toContain('1000 lượt tiếp cận')
      expect(result.features).toContain('Hiệu lực 30 ngày')
      expect(result.features).toContain('Tối đa 10 sản phẩm')
    })

    it('should handle features array initialization even with undefined config', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'abc123',
        name: 'Package Without Config',
        type: 'payPerDay',
        price: '100000',
        description: null,
        config: {},
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      // Verify features is always an array (fixing the "Cannot read properties of undefined" error)
      expect(result.features).toBeInstanceOf(Array)
      expect(Array.isArray(result.features)).toBe(true)
      expect(() => result.features.length).not.toThrow()
    })

    it('should handle limitations array initialization', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'def456',
        name: 'Another Package',
        type: 'payPerDay',
        price: 75000,
        description: 'Another test',
        config: { durationDays: 14 },
        isActive: false,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      // Verify limitations is always an array with default values
      expect(result.limitations).toBeInstanceOf(Array)
      expect(result.limitations.length).toBe(2)
      expect(result.limitations).toContain('Không hoàn tiền')
      expect(result.limitations).toContain('Hiệu lực sau khi kích hoạt')
    })

    it('should convert string price to number', () => {
      const boostPackageWithStringPrice: BoostPackageResponse = {
        id: 'xyz789',
        name: 'String Price Package',
        type: 'payPerDay',
        price: '199000',
        description: 'Price as string',
        config: { durationDays: 30 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackageWithStringPrice)

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(199000)
    })

    it('should handle numeric price directly', () => {
      const boostPackageWithNumericPrice: BoostPackageResponse = {
        id: 'uvw321',
        name: 'Numeric Price Package',
        type: 'payPerDay',
        price: 299000,
        description: 'Price as number',
        config: { durationDays: 60 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackageWithNumericPrice)

      expect(typeof result.price).toBe('number')
      expect(result.price).toBe(299000)
    })

    it('should initialize subscribers and revenue to 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'rst654',
        name: 'Test Revenue Package',
        type: 'payPerDay',
        price: 150000,
        description: 'Test',
        config: { durationDays: 30 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.subscribers).toBe(0)
      expect(result.revenue).toBe(0)
    })

    it('should generate numeric ID from string ID', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'abcdef123456',
        name: 'ID Test Package',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(typeof result.id).toBe('number')
      expect(result.id).toBeGreaterThan(0)
    })

    it('should preserve isActive status', () => {
      const activePackage: BoostPackageResponse = {
        id: 'act001',
        name: 'Active Package',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const inactivePackage: BoostPackageResponse = {
        id: 'ina001',
        name: 'Inactive Package',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: false,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      expect(adminApi.transformBoostPackage(activePackage).isActive).toBe(true)
      expect(adminApi.transformBoostPackage(inactivePackage).isActive).toBe(false)
    })

    it('should handle missing durationDays config for payPerDay type', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'miss001',
        name: 'Missing Duration',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: {}, // Missing durationDays
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.duration).toBe('N/A')
      expect(result.features).toBeInstanceOf(Array)
    })

    it('should handle missing validityDays config for payPerView type', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'miss002',
        name: 'Missing Validity',
        type: 'payPerView',
        price: 25000,
        description: 'Test',
        config: { viewLimit: 500 }, // Missing validityDays
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.duration).toBe('N/A')
      expect(result.features).toBeInstanceOf(Array)
    })

    it('should always return valid ServicePackage structure', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'valid001',
        name: 'Valid Structure Test',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      // Verify all required ServicePackage properties exist
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('price')
      expect(result).toHaveProperty('duration')
      expect(result).toHaveProperty('features')
      expect(result).toHaveProperty('limitations')
      expect(result).toHaveProperty('isActive')
      expect(result).toHaveProperty('subscribers')
      expect(result).toHaveProperty('revenue')

      // Verify all properties match ServicePackage interface
      const servicePackage: ServicePackage = result
      expect(servicePackage).toBeTruthy()
    })

    it('should fix the "Cannot read properties of undefined (reading .length)" error', () => {
      // This simulates the exact error from line 291:78
      // pkg.features.length where features was undefined
      const boostPackage: BoostPackageResponse = {
        id: 'error001',
        name: 'Error Fix Test',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const pkg = adminApi.transformBoostPackage(boostPackage)

      // This should NOT throw "Cannot read properties of undefined"
      expect(() => {
        const length = pkg.features.length
        return length
      }).not.toThrow()

      // Verify the actual access works
      expect(pkg.features.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Features generation based on package type', () => {
    it('should generate payPerDay features correctly', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'feat001',
        name: 'Day Package',
        type: 'payPerDay',
        price: 100000,
        description: 'Test',
        config: {
          durationDays: 14,
          priority: 2,
          maxProducts: 3,
        },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.features).toContain('Đẩy tin 14 ngày')
      expect(result.features).toContain('Độ ưu tiên 2')
      expect(result.features).toContain('Tối đa 3 sản phẩm')
    })

    it('should generate payPerView features correctly', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'feat002',
        name: 'View Package',
        type: 'payPerView',
        price: 50000,
        description: 'Test',
        config: {
          viewLimit: 5000,
          validityDays: 45,
          maxProductsPerBoost: 20,
        },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.features).toContain('5000 lượt tiếp cận')
      expect(result.features).toContain('Hiệu lực 45 ngày')
      expect(result.features).toContain('Tối đa 20 sản phẩm')
    })

    it('should handle default values when config values are missing', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'feat003',
        name: 'Default Values Package',
        type: 'payPerDay',
        price: 50000,
        description: 'Test',
        config: {},
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.features).toBeInstanceOf(Array)
      // Should have empty features for payPerDay without proper config
      // or at least not throw an error
      expect(() => result.features.length).not.toThrow()
    })
  })

  describe('parsePrice helper - NaN/null/undefined handling', () => {
    it('should handle null price and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'null001',
        name: 'Null Price Package',
        type: 'payPerDay',
        price: null,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle undefined price and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'undef001',
        name: 'Undefined Price Package',
        type: 'payPerDay',
        price: undefined,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle empty string price and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'empty001',
        name: 'Empty String Price Package',
        type: 'payPerDay',
        price: '',
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle whitespace-only string price and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'space001',
        name: 'Whitespace Price Package',
        type: 'payPerDay',
        price: '   ',
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle invalid string price (non-numeric) and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'invalid001',
        name: 'Invalid Price Package',
        type: 'payPerDay',
        price: 'invalid',
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle NaN number price and return 0', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'nan001',
        name: 'NaN Price Package',
        type: 'payPerDay',
        price: NaN,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(0)
      expect(typeof result.price).toBe('number')
    })

    it('should handle valid string price correctly', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'valid001',
        name: 'Valid String Price',
        type: 'payPerDay',
        price: '150000',
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(150000)
      expect(typeof result.price).toBe('number')
    })

    it('should handle valid number price correctly', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'valid002',
        name: 'Valid Number Price',
        type: 'payPerDay',
        price: 250000,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(250000)
      expect(typeof result.price).toBe('number')
    })

    it('should handle floating point price correctly', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'float001',
        name: 'Float Price Package',
        type: 'payPerDay',
        price: '99.99',
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      expect(result.price).toBe(99.99)
      expect(typeof result.price).toBe('number')
    })

    it('should prevent NaN from displaying in UI by returning 0 from parsePrice', () => {
      const boostPackage: BoostPackageResponse = {
        id: 'ui001',
        name: 'UI NaN Prevention Test',
        type: 'payPerDay',
        price: NaN,
        description: 'Test',
        config: { durationDays: 7 },
        isActive: true,
        metadata: {},
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const result = adminApi.transformBoostPackage(boostPackage)

      // Price should never be NaN after parsePrice
      expect(isNaN(result.price)).toBe(false)
      expect(result.price).toBe(0)
    })
  })
})
