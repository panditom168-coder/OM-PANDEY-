import React, { useState } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { X, Building2, Check, Sparkles } from 'lucide-react';

export const CustomVillageModal: React.FC = () => {
  const {
    profile,
    updatePanchayatProfile,
    isCustomVillageModalOpen,
    setIsCustomVillageModalOpen,
    language,
    t,
  } = usePanchayat();

  const [villageName, setVillageName] = useState(profile.villageName);
  const [villageNameEn, setVillageNameEn] = useState(profile.villageNameEn || 'My Village Panchayat');
  const [pradhanName, setPradhanName] = useState(profile.pradhanName);
  const [pradhanPhone, setPradhanPhone] = useState(profile.pradhanPhone);
  const [secretaryName, setSecretaryName] = useState(profile.secretaryName);
  const [secretaryPhone, setSecretaryPhone] = useState(profile.secretaryPhone);
  const [block, setBlock] = useState(profile.block);
  const [district, setDistrict] = useState(profile.district);

  if (!isCustomVillageModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePanchayatProfile({
      ...profile,
      villageName: villageName.trim() || 'मेरी ग्राम पंचायत',
      villageNameEn: villageNameEn.trim() || 'My Village Panchayat',
      pradhanName: pradhanName.trim() || 'ग्राम प्रधान',
      pradhanPhone: pradhanPhone.trim() || '+91 98000 00000',
      secretaryName: secretaryName.trim() || 'पंचायत सचिव',
      secretaryPhone: secretaryPhone.trim() || '+91 98000 00001',
      block: block.trim() || 'विकास खंड',
      district: district.trim() || 'जनपद',
    });
    setIsCustomVillageModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-950/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 leading-tight">
                {t('customVillageModalTitle')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {t('customVillageModalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomVillageModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">
              {t('villageNameField')}
            </label>
            <input
              type="text"
              required
              value={language === 'en' ? villageNameEn : villageName}
              onChange={(e) => {
                if (language === 'en') {
                  setVillageNameEn(e.target.value);
                  setVillageName(e.target.value);
                } else {
                  setVillageName(e.target.value);
                  setVillageNameEn(e.target.value);
                }
              }}
              placeholder={language === 'en' ? 'e.g. Rampur Gram Panchayat' : 'उदा. रामपुर खास ग्राम पंचायत'}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-sm text-stone-900 focus:bg-white focus:ring-2 focus:ring-emerald-600 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('pradhanField')}
              </label>
              <input
                type="text"
                value={pradhanName}
                onChange={(e) => setPradhanName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Smt. Sunita Devi' : 'उदा. श्रीमती सुनीता देवी'}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('pradhanPhoneField')}
              </label>
              <input
                type="tel"
                value={pradhanPhone}
                onChange={(e) => setPradhanPhone(e.target.value)}
                placeholder="+91 98000 00000"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('secretaryField')}
              </label>
              <input
                type="text"
                value={secretaryName}
                onChange={(e) => setSecretaryName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Arvind Verma (VDO)' : 'उदा. अरविन्द वर्मा (VDO)'}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('secretaryPhoneField')}
              </label>
              <input
                type="tel"
                value={secretaryPhone}
                onChange={(e) => setSecretaryPhone(e.target.value)}
                placeholder="+91 98000 00001"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('blockField')}
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Central Block' : 'उदा. सदर ब्लॉक'}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {t('districtField')}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder={language === 'en' ? 'e.g. District' : 'उदा. जनपद'}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-stone-900"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsCustomVillageModalOpen(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-sm"
            >
              {t('saveVillageBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
