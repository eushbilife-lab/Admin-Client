import { config } from "config";

class MapsLoaderService {
  private static susbcribers: any = [];
  private static loadingScript: boolean = false;
  static mapsLoaded: boolean = false;
  static emitMapsLoadEvent() {
    MapsLoaderService.susbcribers.forEach((f: any) => {
      f();
    });
    MapsLoaderService.susbcribers = [];
    MapsLoaderService.mapsLoaded = true;
  }
  static subscribe(f: Function) {
    MapsLoaderService.susbcribers.push(f);
  }

  static unsubscribe(f: Function) {
    let newSubscribers: any = [];
    MapsLoaderService.susbcribers.forEach((func: any) => {
      if (func != f) {
        newSubscribers.push(func);
      }
    });
    MapsLoaderService.susbcribers = newSubscribers;
  }
  static LoadMaps() {
    MapsLoaderService.LoadScript(
      `https://maps.googleapis.com/maps/api/js?key=${''}&libraries=places`,
      MapsLoaderService.emitMapsLoadEvent
    );
  }
  static LoadScripts() {
    if (!MapsLoaderService.loadingScript) {
      MapsLoaderService.loadingScript = true;
      MapsLoaderService.LoadMaps();
      MapsLoaderService.LoadScript(
        "https://code.jquery.com/jquery-3.2.1.slim.min.js"
      );
    }
  }
  private static LoadScript(url: string, onLoad: any = null) {
    const script = document.createElement("script");
    script.src = url;
    script.defer = true;
    if (onLoad) {
      script.onload = onLoad;
    }
    document.head.appendChild(script);
  }
}

export default MapsLoaderService;
