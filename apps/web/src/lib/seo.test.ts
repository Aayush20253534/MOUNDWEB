import { describe, expect, it } from "vitest";
import { SITE_ORIGIN, absoluteUrl, breadcrumbGraph, organizationGraph, jsonLd, serviceGraph } from "./seo";
describe("SEO configuration", () => {
  it("uses a single canonical www host", () => {
    expect(SITE_ORIGIN).toBe("https://www.moundweb.tech");
    expect(absoluteUrl("/")).toBe("https://www.moundweb.tech/");
    expect(absoluteUrl("/services/seo")).toBe("https://www.moundweb.tech/services/seo");
    expect(() => absoluteUrl("//another.example")).toThrow();
  });
  it("generates truthful structured data", () => {
    expect(organizationGraph([])["@graph"][0].url).toBe(absoluteUrl("/"));
    expect(serviceGraph({slug:"seo",title:"SEO",summary:"Search"}).url).toBe(absoluteUrl("/services/seo"));
    expect(breadcrumbGraph([{name:"Home",path:"/"},{name:"SEO",path:"/services/seo"}]).itemListElement[1].position).toBe(2);
  });
  it("prevents script tag injection", () => {
    const result = jsonLd({value:"</script>"});
    expect(result).not.toContain("</script>");
    expect(JSON.parse(result).value).toBe("</script>");
  });
});
