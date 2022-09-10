import React from 'react'
import styles from './DragAndDrop.module.css'


interface Props {
  onChangeFiles: (files: File[]) => void,
  acceptType: string, // doesn't work for dropping
  filename?: string,
}

// copied from https://www.codemzy.com/blog/react-drag-drop-file-upload
export default function DragDropFile({ onChangeFiles, acceptType, filename }: Props) {
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // handle drag events
  function handleDrag(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChangeFiles(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  function handleChange(e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onChangeFiles(e.target.files);
    }
  };

  // triggers the input when the button is clicked
  function onButtonClick() {
    inputRef.current?.click();
  };

  return (
    <form className={styles.formFileUpload} onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()} onClick={onButtonClick}>
      <input ref={inputRef} type="file" className={styles.inputFileUpload} multiple={true} onChange={handleChange} accept={acceptType} />
      <label className={`${styles.labelFileUpload} ${dragActive ? "dragActive" : ""}`} htmlFor="inputFileUpload">
        <div>
          <p>Drag and drop the {acceptType} file here, or click to browse.</p>
          {filename && (
            <>
              <div className="text-uppercase text-muted"><small>filename</small></div>
              <p><code>{filename}</code></p>
            </>
          )}
        </div>
      </label>
      {dragActive && <div className={styles.dragFileElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
    </form>
  );
};
