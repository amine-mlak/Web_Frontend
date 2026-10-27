// Design preview (A Werkstatt / B Editorial): shared by the switcher and the root layout.
// The script lives here, not in the client component, so the server layout gets the string.
export const DESIGN_KEY = "beer-design";
export const DESIGN_EVENT = "beer-design";

/** Runs before the first paint, so the chosen direction shows without a flash. */
export const DESIGN_SCRIPT = `(function(){try{var k="${DESIGN_KEY}",p=new URLSearchParams(location.search).get("design");if(p==="aktuell"){localStorage.removeItem(k)}else if(p==="a"||p==="b"){localStorage.setItem(k,p)}var d=localStorage.getItem(k);if(d==="a"||d==="b"){document.documentElement.dataset.design=d}}catch(e){}})();`;
