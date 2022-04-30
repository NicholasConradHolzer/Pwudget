function startErr() {
      if("s-w" in navigator) {
        navigator.s-w.register("../s-w.js") .catch(error =>
          console.log("Service Worker registration failed:", error)
        )
      }
    }
