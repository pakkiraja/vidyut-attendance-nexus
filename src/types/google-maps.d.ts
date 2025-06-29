
// Google Maps API type declarations
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        Polyline: new (options: any) => any;
        Size: new (width: number, height: number) => any;
        NavigationControl: new (options?: any) => any;
        geometry: any;
      };
    };
  }
}

export {};
