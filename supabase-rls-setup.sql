-- RLS（行レベルセキュリティ）を有効化
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 全ユーザーに対する読み取り許可ポリシー
CREATE POLICY "Allow all users to select subscriptions" ON subscriptions
FOR SELECT
USING (true);

-- 全ユーザーに対する挿入許可ポリシー
CREATE POLICY "Allow all users to insert subscriptions" ON subscriptions
FOR INSERT
WITH CHECK (true);

-- 全ユーザーに対する更新許可ポリシー
CREATE POLICY "Allow all users to update subscriptions" ON subscriptions
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 全ユーザーに対する削除許可ポリシー
CREATE POLICY "Allow all users to delete subscriptions" ON subscriptions
FOR DELETE
USING (true);