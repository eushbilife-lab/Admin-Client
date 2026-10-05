// const userAgent: string = navigator.userAgent || navigator.vendor 
const DeviceDetectService={

  isMobileDevice : (userAgent:any): boolean => {
   const regexs = [/(Android)(.+)(Mobile)/i, /BlackBerry/i, /iPhone|iPod/i, /Opera Mini/i, /IEMobile/i]
   return regexs.some((b) => userAgent.match(b))
  },
  isTabletDevice :(userAgent:any): boolean => {
   const regex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/
   return regex.test(userAgent.toLowerCase())
  },
  // isDesktopDevice : (userAgent:any): boolean => !DeviceDetectService.isMobileDevice() && !DeviceDetectService.isTabletDevice()
}



export default DeviceDetectService;
