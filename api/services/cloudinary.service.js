
import cloudinary from '../../config/cloudinary.config.js'

export function uploadStationImage(buffer, stationId) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'oopsify/stations',
                public_id: `station_${stationId}`,
                overwrite: true,
                resource_type: 'image',
            },
            (err, result) => {
                if (err) reject(err)
                else resolve(result)
            }
        ).end(buffer)
    })
}