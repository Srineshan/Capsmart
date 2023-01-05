import domToPdf from "dom-to-pdf";

const toPDF = (selector) => {
  const element = document.querySelector(selector);
  const options = {
    filename: "test.pdf",
    proxyUrl: 'rest.timesmart.io'
  };
  domToPdf(element, options, function () {
    console.log("done");
  });
};

export { toPDF };
