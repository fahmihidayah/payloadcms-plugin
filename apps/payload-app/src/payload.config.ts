// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { softDeletePlugin } from 'payloadcms-soft-delete'
// import { softDeletePlugin } from 'payloadcms-soft-delete'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterLogin: ["./components/LoginView.tsx"],
      views: {
        LoginView: {
          Component: {
            path: "./components/LoginView.tsx",
          }
        }
      }
    }
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    softDeletePlugin({
      collections: {
        "media": {
          enableHardDelete: true,
          hardDeleteAccess: () => Promise.resolve(true),
          enableRestore: true,
          restoreAccess: () => Promise.resolve(true),
          softDeleteAccess: () => Promise.resolve(true),
        },
      }, enabled: true
    })
    // softDeletePlugin({
    //   collections: [],
    //   enabled: true
    // }),



    // storage-adapter-placeholder
  ],
})
