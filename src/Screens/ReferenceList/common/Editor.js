import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import './index.css';
// Custom bold blot
let Inline = Quill.import("blots/inline");
class BoldBlot extends Inline { }
BoldBlot.blotName = "bold";
BoldBlot.tagName = "strong";
Quill.register("formats/bold", BoldBlot);

// Custom button blot
const BlockEmbed = Quill.import("blots/block/embed");

class CustomButtonBlot extends BlockEmbed {
  static create(value) {
    let node = super.create();
    node.setAttribute("class", "custom-button");
    node.textContent = value.text;
    node.setAttribute("data-url", value.url);

    node.style.cursor = "pointer";
    node.addEventListener("click", () => {
      window.open(value.url, "_blank");
    });

    return node;
  }

  static value(node) {
    return {
      text: node.textContent,
      url: node.getAttribute("data-url"),
    };
  }
}

CustomButtonBlot.blotName = "customButton";
CustomButtonBlot.tagName = "button";
Quill.register(CustomButtonBlot);

// Custom checkbox blot
class CustomCheckboxBlot extends BlockEmbed {
  static create(value) {
    let node = super.create(value);
    node.setAttribute("class", "custom-checkbox");
    node.setAttribute("contenteditable", true);
    node.textContent = value || "☐"; // Default to an unchecked checkbox
    node.addEventListener("click", (e) => {
      this.toggleCheckbox(e, node);
    });
    return node;
  }

  static toggleCheckbox(e, node) {
    e.preventDefault(); // Prevent editor focus loss
    node.textContent = node.textContent === "☐" ? "☑" : "☐";
  }

  static value(node) {
    return node.textContent;
  }
}

CustomCheckboxBlot.blotName = "customCheckbox";
CustomCheckboxBlot.tagName = "span";
Quill.register(CustomCheckboxBlot);

const processHtml = (html) => {
  return html
    .replace(
      /<li class="ql-indent-1">/g,
      '<ol style="list-style-type: lower-roman;"><li>'
    )
    .replace(
      /<li class="ql-indent-2">/g,
      '<ol style="list-style-type: lower-alpha;"><li>'
    )
    .replace(/<\/li><\/ol>/g, "</li></ol>");
};

// Custom toolbar component
const CustomToolbar = ({
  handleButtonClick,
  handleCheckBoxClick,
  handleVariableInsert,
  variableOptions,
  selectedVariable,
  handleFontChange,
  handleColorChange,
  handleOpacityChange,
}) => {
  return (
    <div id="toolbar">
      <select className="ql-font" onChange={handleFontChange}>
        <option value="">Font</option>
        <option value="sans-serif">Sans Serif</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="Proxima Nova">Proxima Nova</option>
      </select>

      <select className="ql-header" defaultValue="">
        <option value="1" selected>
          Header 1
        </option>
        <option value="2">Header 2</option>
        <option value="3">Normal</option>
      </select>
      <button className="ql-bold">Bold</button>
      <button className="ql-italic">Italic</button>
      <button className="ql-underline">Underline</button>
      <button className="ql-strike">Strike</button>
      <button className="ql-blockquote">Blockquote</button>
      <button className="ql-list" value="ordered">
        Ordered List
      </button>
      <button className="ql-list" value="bullet">
        Bullet List
      </button>
      <button className="ql-indent" value="-1">
        Decrease Indent
      </button>
      <button className="ql-indent" value="+1">
        Increase Indent
      </button>
      <button className="ql-link">Link</button>
      <button className="ql-image">Image</button>
      <button className="ql-clean">Clean</button>
      <select className="ql-color" onChange={handleColorChange}>
        <option value="">Text Color</option>
        <option value="#000000">Black</option>
        <option value="#FF0000">Red</option>
        <option value="#00FF00">Green</option>
        <option value="#0000FF">Blue</option>
        <option value="#52575D">Gray</option>
        <option value="#94979A">Gray</option>
      </select>
      <select className="ql-opacity" onChange={handleOpacityChange}>
        <option value="">Opacity</option>
        <option value="1">100%</option>
        <option value="0.75">75%</option>
        <option value="0.5">50%</option>
        <option value="0.25">25%</option>
        <option value="0">0%</option>
      </select>
      {/* <select
        className="ql-insertCustomVariables"
        onChange={handleVariableInsert}
      >
        <option value={selectedVariable} disabled selected hidden>
          {selectedVariable}
        </option>
        {variableOptions.map((item) => (
          <option>{item}</option>
        ))}
      </select> */}
      {/* Custom Button for inserting a button element */}
      {/* <button onClick={handleButtonClick} className="custom-toolbar-button">
        Insert Button
      </button>
      <button onClick={handleCheckBoxClick} className="custom-toolbar-checkbox">
        Insert Checkbox
      </button> */}
    </div>
  );
};

// Main editor component
export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorHtml: "",
      savedHtml: "",
      showDropdown: false,
      dropdownPosition: { top: 0, left: 5 },
      variableOptions: ["name", "email", "address"],
      selectedVariable: "Select variables",
      showUrlModal: false, // New state to control modal visibility
      buttonUrl: "", // New state to store the URL
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
    this.handleVariableInsert = this.handleVariableInsert.bind(this);
    this.handleFontChange = this.handleFontChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleOpacityChange = this.handleOpacityChange.bind(this);
  }

  showUrlModal = () => {
    this.setState({ showUrlModal: true });
  };

  hideUrlModal = () => {
    this.setState({ showUrlModal: false, buttonUrl: "" });
  };

  handleSave() {
    const processedHtml = processHtml(this.state.editorHtml);
    console.log("Processed HTML:", processedHtml); // Log the processed HTML
    this.setState({ savedHtml: processedHtml });
  }

  handleButtonClick() {
    this.showUrlModal();
  }

  handleUrlSubmit = () => {
    const quill = this.quillRef.getEditor();
    const range = quill.getSelection();
    const buttonText = "Click me";
    const { buttonUrl } = this.state; // Get the URL from state

    if (buttonText && buttonUrl) {
      const index = range ? range.index : quill.getLength();
      quill.insertEmbed(index, "customButton", {
        text: buttonText,
        url: buttonUrl,
      });
      quill.setSelection(index + 1);
    }

    this.hideUrlModal();
  };

  handleCheckBoxClick() {
    const quill = this.quillRef.getEditor();
    const range = quill.getSelection();

    const checkboxHtml = (
      <span contenteditable="true" class="custom-checkbox">
        ☐
      </span>
    );

    const index = range ? range.index : quill.getLength();

    quill.clipboard.dangerouslyPasteHTML(index, checkboxHtml);

    quill.setSelection(index + checkboxHtml.length);
  }

  handleVariableInsert(event) {
    const quill = this.quillRef.getEditor();
    const variable = event.target.value;

    if (variable && variable !== "Select variables") {
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();
      quill.setSelection(index + variable.length + 2);

      this.setState({ selectedVariable: "Select variables" });
    }
  }

  handleFontChange(event) {
    const quill = this.quillRef.getEditor();
    const font = event.target.value;
    const range = quill.getSelection();

    if (range) {
      quill.format("font", font);
    }
  }

  handleColorChange(event) {
    const quill = this.quillRef.getEditor();
    const color = event.target.value;
    const range = quill.getSelection();

    if (range) {
      quill.format("color", color);
    }
  }

  handleOpacityChange(event) {
    const quill = this.quillRef.getEditor();
    const opacity = event.target.value;
    const range = quill.getSelection();
  }
  render() {
    return (
      <div className="text-editor">
        <CustomToolbar
          handleButtonClick={this.handleButtonClick}
          handleCheckBoxClick={this.handleCheckBoxClick}
          handleVariableInsert={this.handleVariableInsert}
          variableOptions={this.state.variableOptions}
          selectedVariable={this.state.selectedVariable}
          handleFontChange={this.handleFontChange}
          handleColorChange={this.handleColorChange}
          handleOpacityChange={this.handleOpacityChange}
        />
        <ReactQuill
          ref={(el) => {
            this.quillRef = el;
          }}
          value={this.state.editorHtml || this.props.editorHtml}
          onChange={(content) => {
            this.setState({ editorHtml: content });
            this.props.onChange(content);
          }}
          placeholder={this.props.placeholder || "Write something ...."}
          modules={Editor.modules}
          formats={Editor.formats}
        />
        {/* <button onClick={this.handleSave} style={{ marginTop: "10px" }}>
          Save
        </button> */}
        <div
          className="saved-content"
          dangerouslySetInnerHTML={{ __html: this.state.savedHtml }}
        // style={{ all: "inherit" }}
        />
        {/* {this.state.showUrlModal && (
          <div className="modal">
            <div className="modal-content">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <label>Enter Button URL:</label>
                <input
                  type="text"
                  value={this.state.buttonUrl}
                  onChange={(e) => this.setState({ buttonUrl: e.target.value })}
                  style={{ width: "100%", padding: "5px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                <button onClick={this.handleUrlSubmit} className="urlButton">
                  Insert Button
                </button>
                <button onClick={this.hideUrlModal} className="urlCancelButton">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    );
  }
}

Editor.modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertCustomVariables: function (value) {
        const quill = this.quill;
        const cursorPosition = quill.getSelection().index;
        quill.insertText(cursorPosition, value);
        quill.setSelection(cursorPosition + value.length);
      },
    },
  },
};
