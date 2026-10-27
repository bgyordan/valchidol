-- „Нова учебна година“ за документите: празни места (pending=1) за новата година, направени от миналогодишните.
-- prev_id = миналогодишният документ; той стои на сайта, докато на мястото му не се качи нов файл.
ALTER TABLE site_documents ADD COLUMN pending INTEGER NOT NULL DEFAULT 0;
ALTER TABLE site_documents ADD COLUMN prev_id TEXT;
CREATE INDEX IF NOT EXISTS idx_docs_prev ON site_documents(prev_id);
CREATE INDEX IF NOT EXISTS idx_docs_pending ON site_documents(pending, section);
