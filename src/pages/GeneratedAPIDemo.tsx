import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Database, Zap, Palette } from 'lucide-react';

/**
 * Demo page showing how to use the generated API client and UI components
 * This page demonstrates the integration between Swagger schema and React components
 */
export function GeneratedAPIDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Generated API Client Demo</h1>
        <p className="text-xl text-muted-foreground">
          Auto-generated TypeScript API client and React components from Swagger schema
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TypeScript Types</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <p className="text-xs text-muted-foreground">
              Type-safe interfaces generated from OpenAPI schema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Functions</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Auto</div>
            <p className="text-xs text-muted-foreground">
              CRUD operations generated for all endpoints
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">React Hooks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ready</div>
            <p className="text-xs text-muted-foreground">
              useQuery and useMutation hooks for all operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UI Components</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Complete</div>
            <p className="text-xs text-muted-foreground">
              Forms, tables, and modals for all entities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Generated Files Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Files Structure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📡 API Client (src/api/generated/)</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div>├── types.ts <Badge variant="secondary">TypeScript interfaces</Badge></div>
                <div>├── client.ts <Badge variant="secondary">API functions</Badge></div>
                <div>├── hooks.ts <Badge variant="secondary">React hooks</Badge></div>
                <div>└── index.ts <Badge variant="secondary">Exports</Badge></div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🎨 UI Components (src/components/generated/)</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <div>├── ProductManagement.tsx <Badge variant="secondary">CRUD component</Badge></div>
                <div>├── UserManagement.tsx <Badge variant="secondary">CRUD component</Badge></div>
                <div>├── OrderManagement.tsx <Badge variant="secondary">CRUD component</Badge></div>
                <div>└── index.ts <Badge variant="secondary">Exports</Badge></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">1. Using Generated Hooks</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="text-green-600">// Import generated hooks</div>
              <div className="text-blue-600">import</div> {'{ useProducts, useCreateProduct }'} <div className="text-blue-600">from</div> <div className="text-yellow-600">'@/api/generated/hooks'</div>;
              <br />
              <div className="text-green-600">// Use in component</div>
              <div className="text-blue-600">const</div> {'{ data: products, isLoading }'} = <div className="text-purple-600">useProducts</div>();
              <div className="text-blue-600">const</div> createProduct = <div className="text-purple-600">useCreateProduct</div>();
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Using Generated UI Components</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="text-green-600">// Import generated components</div>
              <div className="text-blue-600">import</div> {'{ ProductManagement }'} <div className="text-blue-600">from</div> <div className="text-yellow-600">'@/components/generated'</div>;
              <br />
              <div className="text-green-600">// Use in your page</div>
              <div className="text-blue-600">export default function</div> <div className="text-purple-600">ProductsPage</div>() {'{'}
              <br />
              <div className="ml-4"><div className="text-blue-600">return</div> &lt;<div className="text-red-600">ProductManagement</div> /&gt;;</div>
              <div>{'}'}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Type Safety</h3>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm">
              <div className="text-green-600">// All types are generated from your API schema</div>
              <div className="text-blue-600">interface</div> <div className="text-purple-600">Product</div> {'{'}
              <br />
              <div className="ml-4">id: <div className="text-orange-600">string</div>;</div>
              <div className="ml-4">name: <div className="text-orange-600">string</div>;</div>
              <div className="ml-4">price: <div className="text-orange-600">number</div>;</div>
              <div className="ml-4">description?: <div className="text-orange-600">string</div>;</div>
              <div>{'}'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">API Client Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Type-safe API functions</li>
                <li>✅ Automatic request/response typing</li>
                <li>✅ Error handling</li>
                <li>✅ Request/response interceptors</li>
                <li>✅ Authentication support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">React Hooks Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ useQuery for data fetching</li>
                <li>✅ useMutation for mutations</li>
                <li>✅ Automatic cache invalidation</li>
                <li>✅ Loading and error states</li>
                <li>✅ Optimistic updates</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">UI Components Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Complete CRUD forms</li>
                <li>✅ Data tables with pagination</li>
                <li>✅ Modal dialogs</li>
                <li>✅ Form validation</li>
                <li>✅ Loading states</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Developer Experience</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✅ Auto-completion</li>
                <li>✅ Type checking</li>
                <li>✅ Refactoring support</li>
                <li>✅ Documentation</li>
                <li>✅ Hot reloading</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">1</Badge>
              <div>
                <h4 className="font-semibold">Run the Generator</h4>
                <p className="text-sm text-muted-foreground">
                  Execute the generation script to create API client and UI components from your Swagger schema
                </p>
                <div className="bg-muted p-2 rounded mt-2 font-mono text-sm">
                  ./scripts/generate-all.sh
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">2</Badge>
              <div>
                <h4 className="font-semibold">Import and Use</h4>
                <p className="text-sm text-muted-foreground">
                  Import the generated hooks and components in your application
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">3</Badge>
              <div>
                <h4 className="font-semibold">Customize</h4>
                <p className="text-sm text-muted-foreground">
                  Modify the generated components to match your design system and requirements
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge variant="outline" className="mt-1">4</Badge>
              <div>
                <h4 className="font-semibold">Deploy</h4>
                <p className="text-sm text-muted-foreground">
                  Your application is ready with full type safety and CRUD functionality
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GeneratedAPIDemo;

