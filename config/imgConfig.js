const { v4: uuidv4 } = require('uuid');

const supportedFileTypes = [
    "png", 
    "jpg",
    "jpeg"
]

const imageValidator = (size , mime) =>  {

    if(convertBytesToMb(size) > 2){
        return "Image Size must be less than 2 MB"
    }

    console.log(mime);

    if(!supportedFileTypes.includes(mime)){
        return "Wrong image type"
    }

    console.log('control reaches here')

    return "";

}

const convertBytesToMb = (bytes) => {
    return (Number)(bytes)/(1024 * 1024);
}

const generateRandomNumber = () => {
    return uuidv4();
}

module.exports = {
    imageValidator,
    generateRandomNumber
}