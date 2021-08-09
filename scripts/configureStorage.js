import dotenv from 'dotenv'
dotenv.config()
import { Storage } from '@google-cloud/storage'

const publicBucketName = (process.env.VITE_PUBLIC_BUCKET || '').toString()
const privateBucketName = (process.env.VITE_PRIVATE_BUCKET || '').toString()

const storage = new Storage()
const publicBucket = storage.bucket(publicBucketName)
const privateBucket = storage.bucket(privateBucketName)

async function configureStorage() {
  const corsConfig = {
    method: ['DELETE', 'GET', 'HEAD', 'POST', 'PUT'],
    origin: ['*'],
    responseHeader: ['Content-Type', 'Cache-Control'],
    maxAgeSeconds: 3600
  }
  await Promise.all([
    // public bucket should be public
    publicBucket.makePublic(),

    // cors
    publicBucket.setCorsConfiguration([corsConfig]),
    privateBucket.setCorsConfiguration([corsConfig])
  ])
}
configureStorage()
