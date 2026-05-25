# 任務複製功能 (Task Duplicate Feature)

## 功能概述

新增「複製並重新發起新的任務」功能，允許用戶基於已拒絕或已過期的任務創建新的草稿任務。

## API 規格

### 端點
```POST /api/v1/sign_tasks/duplicate
```

## 功能特點

### 1. 完整複製
- ✅ 任務基本資訊（檔案名稱、簽署類型、排序設定等）
- ✅ 所有簽署階段配置（簽署者、順序、驗證方式）
- ✅ 簽署位置設定（PDF座標、欄位類型、選項）
- ✅ 任務設定（期限、提醒、副本等）
- ✅ 檔案內容（原始檔案、完整檔案、參考檔案）

### 2. 權限控制
- 只允許複製已拒絕或已過期的任務
- 只允許任務擁有者進行複製操作
- 複製後的任務擁有者為當前執行者

### 3. 草稿狀態
- 複製產生的任務為草稿狀態
- 可使用現有的更新API修改簽署者資訊
- 可使用現有的啟動API開始簽署流程

## 實作架構

### 1. 路由配置
```ruby
# config/routes.rb
resources :sign_tasks, param: :sign_task_id do
  collection do
    post 'duplicate'
  end
end
```

### 2. 控制器
```ruby
# app/controllers/api/v1/sign_tasks_controller.rb
def duplicate
  duplicator = Factories::SignTask::DuplicateToDraft.call(
    @task,
    current_member,
    client_info: client_params
  )
  
  return error_response(duplicator.error.key, duplicator.error.message) if duplicator.failed?
  
  success_response(task_id: duplicator.result)
end
```

### 3. 服務層
```ruby
# app/services/factories/sign_task/duplicate_to_draft.rb
class Factories::SignTask::DuplicateToDraft < ServiceCaller
  # 負責複製任務的核心邏輯
  # 包含權限檢查、資料複製、事件記錄等
end
```

### 4. 模型擴展
```ruby
# app/models/sign_task/duplicable.rb
module Duplicable
  def duplicable?
    ['declined', 'expired'].include?(status)
  end
  
  def duplicable_by?(member)
    # 權限檢查邏輯
  end
end
```

## 使用流程

### 1. 基本複製流程
```javascript
// 1. 複製任務（產生草稿）
const response = await fetch('/api/v1/sign_tasks/duplicate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  body: JSON.stringify({
    sign_task_id: 'task_123'
  })
});

const { task_id: newTaskId } = await response.json();
// newTaskId 會是新任務的ID，例如 "tas_xyz789"

// 2. 使用新的任務ID跳轉到編輯頁面，或進行後續操作
window.location.href = `/tasks/${newTaskId}/edit`;
```

## 錯誤處理

### 常見錯誤碼
- `task_not_found`: 原始任務不存在
- `task_not_owned`: 無權限複製非自己的任務
- `task_not_duplicable`: 任務狀態不允許複製
- `member_not_found`: 用戶不存在

## 測試

### 單元測試
- `spec/services/factories/sign_task/duplicate_to_draft_spec.rb`: 服務層測試
- `spec/models/sign_task/duplicable_spec.rb`: 模型測試

### 整合測試  
- `spec/controllers/api/v1/sign_tasks_controller/duplicate_spec.rb`: API測試

## 效能考量

### 1. 檔案複製
- 使用 `copy_to` 方法避免重複下載上傳
- 設定 `skip_callback: true` 避免觸發不必要的後處理

### 2. 資料庫操作
- 使用交易確保資料一致性
- 批量處理相關資料的複製

### 3. 記憶體使用
- 避免載入大型檔案到記憶體
- 使用串流方式處理檔案複製

## 未來擴展

### 1. 部分複製選項
```json
{
  "original_task_id": "task_123",
  "copy_options": {
    "copy_files": false,           // 不複製檔案
    "copy_settings": true,         // 複製設定
    "update_stages": [...]         // 直接更新簽署者
  }
}
```

### 2. 批量複製
```json
{
  "original_task_ids": ["task_1", "task_2", "task_3"],
  "batch_settings": {
    "name_prefix": "複製_",
    "auto_start": false
  }
}
```

### 3. 複製為範本
```json
{
  "original_task_id": "task_123",
  "create_as_template": true,
  "template_name": "標準合約範本"
}
``` 