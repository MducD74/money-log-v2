import { ChangeEvent, useRef, useState } from 'react';
import { createBackup, downloadJson, restoreBackup } from '../utils/backup';
import type { BackupPayload } from '../types';

export function BackupPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  async function exportData() {
    const payload = await createBackup();
    downloadJson(payload);
    setMessage('Đã export dữ liệu ra file JSON.');
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const confirmed = confirm('Import sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?');
    if (!confirmed) {
      event.target.value = '';
      return;
    }

    try {
      const payload = JSON.parse(await file.text()) as BackupPayload;
      await restoreBackup(payload);
      setMessage('Đã import dữ liệu thành công.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể import file backup.');
    } finally {
      event.target.value = '';
    }
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <h2>Dữ liệu</h2>
          <p>Sao lưu và khôi phục file JSON hoàn toàn offline.</p>
        </div>
      </div>

      <div className="backupCard">
        <div className="backupIcon">⇅</div>
        <h3>Backup MoneyLog</h3>
        <p>Export dữ liệu trước khi đổi máy hoặc import file cũ khi cần khôi phục.</p>
        <button className="primaryButton" type="button" onClick={exportData}>
          Export JSON
        </button>
        <button className="ghostButton fullButton" type="button" onClick={() => inputRef.current?.click()}>
          Import JSON
        </button>
        <input ref={inputRef} className="hiddenInput" type="file" accept="application/json" onChange={importData} />
        {message && <p className="statusMessage">{message}</p>}
      </div>
    </section>
  );
}
