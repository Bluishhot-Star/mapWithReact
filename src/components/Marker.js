import { Container as Marker, useNavermaps } from 'react-naver-maps'
import { MarkerShape } from './MarkerShape'

const Marker = (props)=>{
  const navermaps = useNavermaps()
  
  const marker = new Marker({
    position: new navermaps.LatLng(37.4979517, 127.0276188),
    icon: {
      content: [MarkerShape()].join(''),
      size: new navermaps.Size(38, 58),
      anchor: new navermaps.Point(19, 58),
    },
  })


  return(
    <></>
  );
}