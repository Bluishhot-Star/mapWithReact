const MarkerShape = (type) => {
  let contentArray=[];
  switch (type) {
    case "flood":
      contentArray = [
        '<div style="margin: 0; display: table; padding: 0.5rem; table-layout: auto; border-radius: 2.3rem; border: 0.2rem solid var(--flood); background: white; cursor: pointer; position: relative; z-index: 2">',
          '<div style="display: table-cell; display: inline-block; width: 1rem; height: 1rem; background-image: url(flood.svg); color:red; background-size: cover; background-position: center; background-repeat: no-repeat;"></div>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: #ffffff transparent; display: block; width: 0; z-index: 1; top: 1.95rem; left: 0.3rem;"></span>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: var(--flood) transparent; display: block; width: 0; z-index: 0; top: 2.2rem; left: 0.3rem;"></span>',
        '</div>',
      ];
      break;
    
    case "hot":
      contentArray = [
        '<div style="margin: 0; display: table; padding: 0.5rem; table-layout: auto; border-radius: 2.3rem; border: 0.2rem solid var(--swelter); background: white; cursor: pointer; position: relative; z-index: 2">',
          '<div style="display: table-cell; display: inline-block; width: 1rem; height: 1rem; background-image: url(severe_hot.svg); color:red; background-size: cover; background-position: center; background-repeat: no-repeat;"></div>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: #ffffff transparent; display: block; width: 0; z-index: 1; top: 1.95rem; left: 0.3rem;"></span>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: var(--swelter) transparent; display: block; width: 0; z-index: 0; top: 2.2rem; left: 0.3rem;"></span>',
        '</div>',
      ];
      break;
    
    case "cold":
      contentArray = [
        '<div style="margin: 0; display: table; padding: 0.5rem; table-layout: auto; border-radius: 2.3rem; border: 0.2rem solid var(--severeCold); background: white; cursor: pointer; position: relative; z-index: 2">',
          '<div style="display: table-cell; display: inline-block; width: 1rem; height: 1rem; background-image: url(severe_cold.svg); color:red; background-size: cover; background-position: center; background-repeat: no-repeat;"></div>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: #ffffff transparent; display: block; width: 0; z-index: 1; top: 1.95rem; left: 0.3rem;"></span>',
          '<span style="position: absolute; border-style: solid; border-width: 0.7rem 0.7rem 0 0.7rem; border-color: var(--severeCold) transparent; display: block; width: 0; z-index: 0; top: 2.2rem; left: 0.3rem;"></span>',
        '</div>',
      ];
      break;
    
    default:
      contentArray = [
        '<div style="margin: 0; display: table; padding: 0.5rem; table-layout: auto; border-radius: 2.3rem; border: 0.2rem solid var(--color--darkgreen); background: white; cursor: pointer; position: relative; z-index: 2">',
        '<div style="display: table-cell; display: inline-block; width: 2.5rem; height: 2.5rem; background-image: url(logo192.png); color:red; background-size: cover; background-position: center; background-repeat: no-repeat;"></div>',
        '<span style="position: absolute; border-style: solid; border-width: 1rem 1rem 0 1rem; border-color: #ffffff transparent; display: block; width: 0; z-index: 1; top: 3.1rem; left: 0.75rem;"></span>',
        '</div>',
      ];
      break;
  }
  
  return contentArray.join('');
};

export default MarkerShape;