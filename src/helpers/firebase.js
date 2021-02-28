const admin = require('firebase-admin')

const service = './service.json'

admin.initializeApp({
    credential:admin.credential.cert(service),
    storageBucket:'gs://ml-kit-46948.appspot.com',
})

const upload = async()=>{
    const storageRef = admin.storage().bucket()
    try {
        
    const res = await storageRef.upload('lms-logo.jpeg',{
        gzip:true,metadata:{
            cacheControl: "public, max-age=31536000",
        }
    })

    await storageRef.file('lms-logo.jpeg',).makePublic()

    console.log(res[0].metadata.mediaLink);
    } catch (error) {
        console.log(error);
    }
}

upload()