import domToPdf from "dom-to-pdf";

const toPDF = (selector, filename) => {
  const element = document.querySelector(selector);
  const options = {
    filename: filename,
    excludeClassNames: ['ExcludeMeFromPdf'],
    scale: 1,
    imageType: 'jpeg',
    imageQuality: 0.7,
    jsPDF: {
      format: 'a4',
      unit: 'mm',
      orientation: 'portrait',
    },

    html2canvas: {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: true,
    },

    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
  };
  domToPdf(element, options, function () {
  });
};

export { toPDF };
