'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [currentLang, setCurrentLang] = useState('zh-TW');

  return (
    <PageLayout currentLang={currentLang} setCurrentLang={setCurrentLang} showBackButton={true}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            隱私權政策
          </h1>
          <p className="text-gray-600">
            最後更新日期：2025 年 11 月 19 日
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-3 text-blue-600" />
                我們如何保護您的隱私
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Tryzeon（以下簡稱「我們」）非常重視您的隱私權。本隱私權政策說明我們如何收集、使用、儲存和保護您的個人資料。
              </p>
              <p className="text-gray-700 leading-relaxed">
                使用 Tryzeon 服務即表示您同意本隱私權政策的內容。如果您不同意本政策，請勿使用我們的服務。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Database className="w-6 h-6 mr-3 text-blue-600" />
                我們收集哪些資料
              </h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">1. 您主動提供的資料</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>帳戶資訊：</strong>姓名、電子郵件、密碼</li>
                <li><strong>個人照片：</strong>用於虛擬試穿的照片</li>
                <li><strong>聯絡資訊：</strong>用於客服和通知的聯絡方式</li>
                <li><strong>付款資訊：</strong>訂閱服務時的付款資料（由第三方支付平台處理）</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2. 自動收集的資料</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>使用資料：</strong>您如何使用我們的服務（試穿次數、瀏覽記錄等）</li>
                <li><strong>裝置資訊：</strong>裝置類型、作業系統、瀏覽器類型</li>
                <li><strong>日誌資料：</strong>IP 位址、存取時間、錯誤日誌</li>
                <li><strong>Cookies：</strong>用於改善使用體驗的 Cookie 資料</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3 text-blue-600" />
                我們如何使用您的資料
              </h2>
              
              <ul className="list-disc pl-6 space-y-3 text-gray-700">
                <li>
                  <strong>提供服務：</strong>使用您的照片生成虛擬試穿效果
                </li>
                <li>
                  <strong>改善服務：</strong>分析使用數據以優化 AI 模型和使用體驗
                </li>
                <li>
                  <strong>客戶支援：</strong>回應您的問題和需求
                </li>
                <li>
                  <strong>安全維護：</strong>偵測和防止詐欺、濫用行為
                </li>
                <li>
                  <strong>行銷通知：</strong>發送產品更新、優惠資訊（您可隨時取消訂閱）
                </li>
                <li>
                  <strong>法律義務：</strong>遵守相關法律法規要求
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">資料安全</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                我們採取多重安全措施保護您的資料：
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>加密傳輸：</strong>使用 SSL/TLS 加密所有資料傳輸</li>
                <li><strong>加密儲存：</strong>敏感資料經過加密後儲存</li>
                <li><strong>存取控制：</strong>嚴格限制員工對資料的存取權限</li>
                <li><strong>定期審查：</strong>定期進行安全審查和漏洞測試</li>
                <li><strong>自動刪除：</strong>照片處理完成後會自動刪除（除非您選擇保存）</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">資料分享</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                我們<strong>不會</strong>出售您的個人資料。我們僅在以下情況分享資料：
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>服務提供商：</strong>協助我們提供服務的第三方（如雲端儲存、支付處理）</li>
                <li><strong>商業夥伴：</strong>經您同意後，與合作品牌分享必要資訊</li>
                <li><strong>法律要求：</strong>依法律規定或政府要求提供資料</li>
                <li><strong>企業交易：</strong>在併購、重組等情況下轉移資料</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
                您的權利
              </h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                您對自己的資料擁有以下權利：
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>存取權：</strong>查看我們持有的您的個人資料</li>
                <li><strong>更正權：</strong>要求更正不正確的資料</li>
                <li><strong>刪除權：</strong>要求刪除您的個人資料</li>
                <li><strong>限制權：</strong>限制我們處理您的資料</li>
                <li><strong>可攜權：</strong>以結構化格式取得您的資料</li>
                <li><strong>反對權：</strong>反對我們處理您的資料</li>
              </ul>
              
              <p className="text-gray-700 leading-relaxed mt-4">
                如需行使這些權利，請透過 <a href="mailto:contact@tryzeon.com" className="text-blue-600 hover:text-blue-800">contact@tryzeon.com</a> 聯絡我們。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">兒童隱私</h2>
              
              <p className="text-gray-700 leading-relaxed">
                我們的服務不適用於 13 歲以下的兒童。我們不會故意收集 13 歲以下兒童的個人資料。如果您發現我們收集了兒童的資料，請立即聯絡我們。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">Cookie 政策</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                我們使用 Cookie 和類似技術來：
              </p>
              
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>記住您的偏好設定</li>
                <li>分析網站流量和使用情況</li>
                <li>提供個人化內容和廣告</li>
                <li>改善網站功能和性能</li>
              </ul>
              
              <p className="text-gray-700 leading-relaxed mt-4">
                您可以透過瀏覽器設定管理或刪除 Cookie，但這可能影響某些功能的使用。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold mb-4">政策更新</h2>
              
              <p className="text-gray-700 leading-relaxed">
                我們可能會不定期更新本隱私權政策。重大變更時，我們會透過 Email 或 App 通知您。建議您定期查看本頁面以了解最新政策。
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
              <h2 className="text-2xl font-bold mb-4 text-blue-900">聯絡我們</h2>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                如果您對本隱私權政策有任何疑問或建議，請透過以下方式聯絡我們：
              </p>
              
              <ul className="space-y-2 text-gray-700">
                <li><strong>Email：</strong><a href="mailto:contact@tryzeon.com" className="text-blue-600 hover:text-blue-800">contact@tryzeon.com</a></li>
                <li><strong>Instagram：</strong><a href="https://www.instagram.com/tryzeon" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">@tryzeon</a></li>
                <li><strong>公司名稱：</strong>Tryzeon</li>
              </ul>
            </div>
        </div>
      </div>
    </PageLayout>
  );
}
