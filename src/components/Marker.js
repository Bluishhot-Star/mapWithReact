import { Container as Marker } from 'react-naver-maps'

const Marker = (props)=>{
  const navermaps = useNavermaps()
  return(
    <Marker
        defaultPosition={new navermaps.LatLng(props.latitude, props.longitude)}
    />
  );
}