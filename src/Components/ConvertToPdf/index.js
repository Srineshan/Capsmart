import domToPdf from "dom-to-pdf";

const toPDF = (selector, filename) => {
  const element = document.querySelector(selector);
  const options = {
    filename: filename,
    excludeClassNames: ['ExcludeMeFromPdf'],
  };
  domToPdf(element, options, function () {
  });
};

export { toPDF };
