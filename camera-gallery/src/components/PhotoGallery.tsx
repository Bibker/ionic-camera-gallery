import React from "react";
import { PhotoItem } from "../types/PhotoItem";
import { IonGrid, IonRow, IonCol, IonImg, IonFab, IonFabButton, IonIcon, useIonAlert } from '@ionic/react';
import { trash } from "ionicons/icons";

type Props = {
    photos: PhotoItem[],
    deletePhoto: (fileName: string) => void
}

const PhotoGallery: React.FC<Props> = ({ photos, deletePhoto }) => {
    const [displayAlert] = useIonAlert();
    const confirmDelete = (fileName: string) =>
    displayAlert({
        message:"Sure to delete the photo?",
        buttons:[
            {text:'Cancel', role:'cancel'},
            {text:'Delete', role:'confirm'}
        ],
        onDidDismiss: (e)=> {
            if(e.detail.role==='cancel') return;
            deletePhoto(fileName);
        }
    });

    return (
        <IonGrid>
            <IonRow>
                {photos.map((photo, idx) => (
                    <IonCol size="6" key={idx}>
                        <IonFab vertical="bottom" horizontal="center">
                            <IonFabButton 
                            onClick={()=> confirmDelete(photo.filePath)}
                            size="small"
                            color="light"
                            >
                                <IonIcon icon={trash} color="danger">

                                </IonIcon>
                            </IonFabButton>

                        </IonFab>
                        <IonImg src= {photo.webviewPath}/>
                    </IonCol>
                ))}
            </IonRow>
        </IonGrid>

    )
}

export default PhotoGallery;