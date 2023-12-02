import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import { camera } from 'ionicons/icons';
import { usePhotoGallery } from '../hooks/usePhotoGallery';
import PhotoGallery from '../components/PhotoGallery';

const Home: React.FC = () => {
  const {photos, takePhoto, deletePhoto} = usePhotoGallery();
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <PhotoGallery photos={photos} deletePhoto ={deletePhoto}/>
        <IonFab vertical="top" horizontal='end' slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera}/>
          </IonFabButton>
        </IonFab>


      </IonContent>
    </IonPage>
  );
};

export default Home;
