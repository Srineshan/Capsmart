import domToPdf from "dom-to-pdf";

const toPDF = (selector) => {
  const element = document.querySelector(selector);
  const options = {
    filename: "report.pdf",
    excludeClassNames: ['ExcludeMeFromPdf'],
    // proxyUrl: 'http://localhost:3000/'
  };
  domToPdf(element, options, function () {
    console.log("done");
  });
};

export { toPDF };
