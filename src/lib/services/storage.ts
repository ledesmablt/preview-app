import { Storage } from '@google-cloud/storage'

const publicBucketName: string = (
  import.meta.env.VITE_PUBLIC_BUCKET || ''
).toString()
const privateBucketName: string = (
  import.meta.env.VITE_PRIVATE_BUCKET || ''
).toString()

const storage = new Storage()
export const publicBucket = storage.bucket(publicBucketName)
export const privateBucket = storage.bucket(privateBucketName)
