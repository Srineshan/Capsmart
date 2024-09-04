import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.css";

const Font = Quill.import("formats/font");
Font.whitelist = [
    "arial",
    "comic-sans",
    "courier-new",
    "georgia",
    "helvetica",
    "lucida",
    "proxima-nova",
];
Quill.register(Font, true);

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);
// Custom bold blot
// let Inline = Quill.import("blots/inline");
// class BoldBlot extends Inline {}
// BoldBlot.blotName = "bold";
// BoldBlot.tagName = "strong";
// Quill.register("formats/bold", BoldBlot);

// Custom button blot
const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {
    static create() {
        let node = super.create();
        node.setAttribute("class", "custom-divider");
        return node;
    }

    static value(node) {
        return {}; // No value needed for the divider
    }
}

DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr"; // Using <hr> tag for divider
Quill.register(DividerBlot);

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
    handleDividerClick,
}) => {
    return (
        <div id="toolbar">
            <select className="ql-font">
                <option value="arial">Arial</option>
                <option value="proxima-nova">Proxima Nova</option>
            </select>

            <select className="ql-header" defaultValue="">
                <option value="1">Header 1</option>
                <option value="2">Header 2</option>
                <option value="3">Header 3</option>
                <option value="4">Header 4</option>
                <option value="5">Header 5</option>
                <option value="6">Header 6</option>
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
            <select className="ql-align" />
            <select className="ql-color">
                <option value="#94979A"></option>
                <option value="#52575d"></option>
            </select>
            <select className="ql-background" />
            <button className="ql-clean" />

            <select
                className="ql-insertCustomVariables"
                onChange={handleVariableInsert}
            >
                <option value={selectedVariable} disabled selected hidden>
                    {selectedVariable}
                </option>
                {variableOptions.map((item) => (
                    <option key={item}>{item}</option>
                ))}
            </select>
            {/* <button onClick={handleButtonClick} className="custom-toolbar-button">
                Insert Button
            </button>
            <button onClick={handleCheckBoxClick} className="custom-toolbar-checkbox">
                Insert Checkbox
            </button>
            <button onClick={handleDividerClick} className="custom-toolbar-divider">
                Divider
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
            showUrlModal: false,
            buttonUrl: "",
        };

        this.handleSave = this.handleSave.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
        this.handleVariableInsert = this.handleVariableInsert.bind(this);
        this.handleLineSpacingChange = this.handleLineSpacingChange.bind(this);
        this.handleDividerClick = this.handleDividerClick.bind(this);
    }

    handleDividerClick() {
        const quill = this.quillRef.getEditor();
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, "divider", {});
        quill.setSelection(index + 1);
    }

    handleLineSpacingChange(event) {
        const lineSpacing = event.target.value;
        const quill = this.quillRef.getEditor();
        quill.format("lineHeight", lineSpacing); // Apply the line spacing to the editor

        this.setState({ lineSpacing });
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

        const checkboxHtml = `<span contenteditable="true" class="custom-checkbox">☐</span>`;

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
            quill.insertText(index, `{${variable}}`);
            quill.setSelection(index + variable.length + 2);

            this.setState({ selectedVariable: "Select variables" });
        }
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
                    handleDividerClick={this.handleDividerClick}
                />
                <ReactQuill
                    ref={(el) => {
                        this.quillRef = el;
                    }}
                    value={this.state.editorHtml}
                    onChange={(content) => this.setState({ editorHtml: content })}
                    placeholder={"Write something ...."}
                    modules={Editor.modules}
                    formats={Editor.formats}
                />
                <button onClick={this.handleSave} style={{ marginTop: "10px" }}>
                    Save
                </button>
                <div
                    className="saved-content"
                    dangerouslySetInnerHTML={{ __html: this.state.savedHtml }}
                // style={{ all: "inherit" }}
                />
                {this.state.showUrlModal && (
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
                )}
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
            color: function (value) {
                const quill = this.quill;
                const range = quill.getSelection();
                if (range && range.length > 0) {
                    // If text is selected, apply format to the selected text
                    quill.format("color", value);
                } else {
                    // If no text is selected, apply format to the cursor for the next input
                    quill.format("color", value);
                }
            },
            background: function (value) {
                const quill = this.quill;
                const range = quill.getSelection();
                if (range && range.length > 0) {
                    quill.format("background", value);
                } else {
                    quill.format("background", value);
                }
            },
            font: function (value) {
                const quill = this.quill;
                const range = quill.getSelection();
                if (range && range.length > 0) {
                    quill.format("font", value);
                } else {
                    quill.format("font", value);
                }
            },
            divider: function () {
                const quill = this.quill;
                const range = quill.getSelection();
                const index = range ? range.index : quill.getLength();
                quill.insertEmbed(index, "divider", {});
                quill.setSelection(index + 1);
            },
        },
    },
};

Editor.formats = [
    "color",
    "background",
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "font",
    "customButton",
    "customCheckbox",
    "lineHeight",
    "divider",
];
