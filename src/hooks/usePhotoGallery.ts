import { useEffect, useState } from "react";
import { PhotoItem } from "../types/PhotoItem";
import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { isPlatform } from "@ionic/react";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const PHOTOS_PREF_KEY = 'phots';



export const usePhotoGallery = () => {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);


    useEffect(() => {
        const loadSaved = async () => {
            const { value } = await Preferences.get({ key: PHOTOS_PREF_KEY });
            console.log("🚀 ~ file: usePhotoGallery.ts:20 ~ loadSaved ~ value:", value)
            const photosInPrefs: PhotoItem[] = value ? JSON.parse(value): [];

            if(!isPlatform('hybrid'))
            {
                for(let photo of photosInPrefs){
                    const file = await Filesystem.readFile({
                        path:photo.filePath,
                        directory: Directory.Data
                    })
                    console.log("🚀 ~ file: usePhotoGallery.ts:30 ~ loadSaved ~ file:", file)
                    photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
                }

            }

            setPhotos(photosInPrefs);
        }
        loadSaved();

    }, []);

    useEffect(()=> {
        if(photos.length > 0)
            Preferences.set({key:PHOTOS_PREF_KEY, value: JSON.stringify(photos)})

    }, [photos])

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        })
        console.log("🚀 ~ file: usePhotoGallery.ts:16 ~ takePhoto ~ photo:", photo)

        const fileName = new Date().getTime() + '.jpeg';
        const savedFileImage = await savePhoto(photo, fileName)

        console.log("🚀 ~ file: usePhotoGallery.ts:19 ~ takePhoto ~ savedFileImage:", savedFileImage)
        setPhotos([...photos, savedFileImage]);
    };

    const savePhoto = async (photo: Photo, fileName: string): Promise<PhotoItem> => {
        let base64data: string | Blob;
        if (isPlatform('hybrid')) {
            const file = await Filesystem.readFile({
                path: photo.path!
            })
            console.log(file);
            base64data = file.data
        }
        else {
            base64data = await base64FromPath(photo.webPath!);
            console.log("🚀 ~ file: usePhotoGallery.ts:39 ~ savePhoto ~ base64data:", base64data)
        }

        const savedFile = await Filesystem.writeFile({
            path: fileName,
            directory: Directory.Data,
            data: base64data
        })
        console.log("🚀 ~ file: usePhotoGallery.ts:44 ~ savePhoto ~ savedFile:", savedFile)

        if (isPlatform('hybrid')) {
            return {
                filePath: savedFile.uri,
                webviewPath: Capacitor.convertFileSrc(savedFile.uri)
            }
        }

        return {
            filePath: fileName,
            webviewPath: photo.webPath
        }

    }

    async function base64FromPath(path: string): Promise<string> {
        const response = await fetch(path);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = reject;
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                }
                else {
                    reject('Method did not return a string');
                }
            };
            reader.readAsDataURL(blob);
        })

    }

    const deletePhoto = async (fileName: string) => {

        setPhotos(photos.filter((photo) => photo.filePath !== fileName));
        await Filesystem.deleteFile({
            path: fileName,
            directory: Directory.Data
        });
    };


    return {
        photos,
        takePhoto,
        deletePhoto
    }
}