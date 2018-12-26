import React, { Component } from 'react';
import styles from './index.module.scss';

class EditingTools extends Component {
  handleOpen = () => {
    this.file.click();
  };

  render() {
    const {
      onOpenFIle,
      onZoomIn,
      onZoomOut,
      onZoomReset,
      onUndo,
      onRedo,
      onSave,
      onDownloadXml,
      onDownloadSvg
    } = this.props;
    return (
      <div className={styles.editingTools}>
        <ul className={styles.controlList}>
          <li className={`${styles.control} ${styles.line}`}>
            <input
              ref={(file) => {
                this.file = file;
              }}
              className={styles.openFile}
              type="file"
              onChange={onOpenFIle}
            />
            <button type="button" title="open" onClick={this.handleOpen}>
              <i className={styles.open} />
            </button>
          </li>

          <li className={styles.control}>
            <button type="button" title="undo" onClick={onUndo}>
              <i className={styles.undo} />
            </button>
          </li>
          <li className={`${styles.control} ${styles.line}`}>
            <button type="button" title="redo" onClick={onRedo}>
              <i className={styles.redo} />
            </button>
          </li>

          <li className={styles.control}>
            <button type="button" title="reset zoom" onClick={onZoomReset}>
              <i className={styles.zoom} />
            </button>
          </li>
          <li className={styles.control}>
            <button type="button" title="zoom in" onClick={onZoomIn}>
              <i className={styles.zoomIn} />
            </button>
          </li>
          <li className={`${styles.control} ${styles.line}`}>
            <button type="button" title="zoom out" onClick={onZoomOut}>
              <i className={styles.zoomOut} />
            </button>
          </li>

          <li className={styles.control}>
            <button type="button" title="save" onClick={onSave}>
              <i className={styles.save} />
            </button>
          </li>
          <li className={styles.control}>
            <button type="button" title="download bpmn diagram" onClick={onDownloadXml}>
              <i className={styles.download} />
            </button>
          </li>
          <li className={styles.control}>
            <button type="button" title="download as svg image" onClick={onDownloadSvg}>
              <i className={styles.image} />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default EditingTools;
