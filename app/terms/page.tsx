import type { Metadata } from 'next';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  locale: 'zh-TW',
  path: '/terms',
  ...copy.meta.terms,
});

export const revalidate = 3600;

export default function TermsOfServicePage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
            <FileText className="w-16 h-16 mx-auto text-[#2563EB] mb-4" />
            <h1 className="cjk-punct font-serif font-black tracking-[-0.02em] text-4xl md:text-5xl text-[#101828] mb-4">
              服務條款
            </h1>
            <p className="text-[#475467]">
              最後更新日期：2025 年 11 月 19 日
            </p>
        </div>

        {/* Content */}
        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">歡迎使用 Tryzeon</h2>
          <p className="text-[#475467] leading-relaxed mb-4">
            感謝您使用 Tryzeon 的服務。本服務條款（以下簡稱「條款」）規範您使用 Tryzeon 平台和相關服務的權利和義務。
          </p>
          <p className="text-[#475467] leading-relaxed">
            使用我們的服務即表示您同意遵守本條款。如果您不同意本條款，請勿使用我們的服務。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">1. 服務說明</h2>
              
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">1.1 服務內容</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            Tryzeon 提供以下服務：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>AI 虛擬試穿技術</li>
            <li>動態影片生成</li>
            <li>創作者平台</li>
            <li>B2B 解決方案</li>
            <li>其他相關服務</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">1.2 服務變更</h3>
          <p className="text-[#475467] leading-relaxed">
            我們保留隨時修改、暫停或終止部分或全部服務的權利，恕不另行通知。我們不對服務的修改、暫停或終止承擔責任。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">2. 帳戶註冊</h2>
              
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">2.1 註冊資格</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            您必須年滿 13 歲才能註冊帳戶。未滿 18 歲的用戶需獲得家長或監護人同意。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">2.2 帳戶安全</h3>
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>您有責任保管帳戶密碼</li>
            <li>您對帳戶下的所有活動負責</li>
            <li>如發現未經授權的使用，請立即通知我們</li>
            <li>我們不對未經授權的帳戶使用承擔責任</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">2.3 帳戶終止</h3>
          <p className="text-[#475467] leading-relaxed">
            您可以隨時刪除帳戶。我們也保留在您違反本條款時暫停或終止您帳戶的權利。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">3. 使用規範</h2>
              
          <div className="rounded-2xl border border-[#06B6D4]/25 bg-[#06B6D4]/5 p-5 mb-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#0891B2] mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-[#164E63] mb-2">允許的使用</h4>
                <ul className="list-disc pl-6 space-y-1 text-[#155E75]">
                  <li>個人非商業用途的虛擬試穿</li>
                  <li>創作合法的時尚內容</li>
                  <li>與品牌的合法商業合作</li>
                  <li>分享試穿效果到社群媒體</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#101828]/10 bg-white/60 p-5">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-[#475467] mr-3 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-[#101828] mb-2">禁止的使用</h4>
                <ul className="list-disc pl-6 space-y-1 text-[#475467]">
                  <li>上傳他人照片而未獲得授權</li>
                  <li>生成不當、違法或侵權的內容</li>
                  <li>濫用服務進行大量自動化操作</li>
                  <li>試圖破解、攻擊或干擾服務</li>
                  <li>侵犯他人隱私或智慧財產權</li>
                  <li>用於詐欺、騷擾或其他非法目的</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">4. 智慧財產權</h2>
              
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">4.1 我們的權利</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            Tryzeon 平台、技術、商標、Logo 和所有相關內容的智慧財產權歸 Tryzeon 所有。未經授權，您不得複製、修改、分發或使用。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">4.2 您的權利</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            您上傳的照片和生成的內容，您保留所有權利。但您授予我們以下權利：
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>使用您的照片生成虛擬試穿效果</li>
            <li>儲存和處理您的內容以提供服務</li>
            <li>在您同意的情況下，用於行銷和展示目的</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">4.3 侵權處理</h3>
          <p className="text-[#475467] leading-relaxed">
            如果您認為有內容侵犯了您的權利，請透過 contact@tryzeon.com 聯絡我們，我們會盡快處理。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">5. 付費服務</h2>
              
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">5.1 訂閱方案</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            我們提供免費和付費訂閱方案。付費方案的詳細內容和價格請參閱 App 內說明。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">5.2 付款</h3>
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>所有價格均以新台幣（TWD）或美元（USD）計價</li>
            <li>付款透過第三方支付平台處理（Apple Pay、Google Pay 等）</li>
            <li>訂閱會自動續約，除非您取消</li>
            <li>我們不儲存您的完整信用卡資訊</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">5.3 退款政策</h3>
          <p className="text-[#475467] leading-relaxed">
            除法律規定外，訂閱費用一經支付不予退款。如有特殊情況，請聯絡客服討論。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">6. 免責聲明</h2>
              
          <p className="text-[#475467] leading-relaxed mb-4">
            在法律允許的範圍內：
          </p>
              
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>服務以「現狀」提供，不提供任何明示或暗示的保證</li>
            <li>我們不保證服務不中斷、無錯誤或完全安全</li>
            <li>虛擬試穿效果僅供參考，實際效果可能有差異</li>
            <li>我們不對您使用服務產生的任何損失負責</li>
            <li>我們不對第三方內容或連結負責</li>
          </ul>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">7. 責任限制</h2>
              
          <p className="text-[#475467] leading-relaxed mb-4">
            在法律允許的最大範圍內，Tryzeon 及其員工、董事、合作夥伴不對以下情況承擔責任：
          </p>
              
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>任何間接、附帶、特殊或懲罰性損害</li>
            <li>利潤損失、資料遺失或業務中斷</li>
            <li>因使用或無法使用服務造成的損害</li>
            <li>第三方的行為或內容</li>
          </ul>
              
          <p className="text-[#475467] leading-relaxed mt-4">
            我們的總責任不超過您在過去 12 個月內支付給我們的金額。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">8. 爭議解決</h2>
              
          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">8.1 適用法律</h3>
          <p className="text-[#475467] leading-relaxed mb-4">
            本條款受中華民國法律管轄。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-[#101828]">8.2 爭議處理</h3>
          <p className="text-[#475467] leading-relaxed">
            如有任何爭議，雙方應先嘗試友好協商。協商不成時，提交台灣台北地方法院管轄。
          </p>
        </div>

        <div className="glass-panel p-7 md:p-9 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">9. 條款變更</h2>
              
          <p className="text-[#475467] leading-relaxed mb-4">
            我們可能會不定期更新本條款。重大變更時，我們會透過以下方式通知您：
          </p>
              
          <ul className="list-disc pl-6 space-y-2 text-[#475467]">
            <li>Email 通知</li>
            <li>App 內通知</li>
            <li>網站公告</li>
          </ul>
              
          <p className="text-[#475467] leading-relaxed mt-4">
            變更生效後繼續使用服務，即表示您接受新的條款。
          </p>
        </div>

        <div className="rounded-3xl border border-[#2563EB]/15 bg-[#2563EB]/5 p-7 md:p-9">
          <h2 className="text-2xl font-bold mb-4 text-[#101828]">聯絡我們</h2>
              
          <p className="text-[#475467] leading-relaxed mb-4">
            如果您對本服務條款有任何疑問，請聯絡我們：
          </p>
              
          <ul className="space-y-2 text-[#475467]">
            <li><strong>Email：</strong><a href="mailto:contact@tryzeon.com" className="text-[#1D4ED8] underline-offset-4 hover:text-[#2563EB] hover:underline">contact@tryzeon.com</a></li>
            <li><strong>Instagram：</strong><a href="https://www.instagram.com/tryzeon" target="_blank" rel="noopener noreferrer" className="text-[#1D4ED8] underline-offset-4 hover:text-[#2563EB] hover:underline">@tryzeon</a></li>
            <li><strong>公司名稱：</strong>創然科技有限公司（Tryzeon）</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
