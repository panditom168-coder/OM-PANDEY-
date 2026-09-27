import React, { useState } from 'react';
import { usePanchayat } from '../context/PanchayatContext';
import { ShieldAlert, Lock, KeyRound, Eye, EyeOff, ArrowLeft, Check, Key } from 'lucide-react';

export const AdminLockScreen: React.FC = () => {
  const { unlockAdmin, setViewMode, profile, language, changeAdminPin, t } = usePanchayat();
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Secret PIN change modal / accordion
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showSecretPins, setShowSecretPins] = useState(false);
  const [changePinMsg, setChangePinMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const isEn = language === 'en';

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg(isEn ? 'Please enter your confidential PIN.' : 'कृपया अपना गोपनीय सुरक्षा पिन दर्ज करें।');
      triggerShake();
      return;
    }

    setIsVerifying(true);
    const success = await unlockAdmin(pinInput);
    setIsVerifying(false);

    if (success) {
      setErrorMsg(null);
    } else {
      setErrorMsg(isEn ? 'Incorrect PIN! Access denied.' : 'गलत पिन! प्रवेश अस्वीकृत। केवल अधिकृत एडमिन ही खोल सकते हैं।');
      triggerShake();
      setPinInput('');
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 6) {
      setPinInput((prev) => prev + val);
      setErrorMsg(null);
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleSecretPinChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setChangePinMsg({
        text: isEn ? 'New PIN must be at least 4 digits.' : 'नया पिन कम से कम 4 अंकों का होना चाहिए।',
        isError: true,
      });
      return;
    }

    if (newPin !== confirmPin) {
      setChangePinMsg({
        text: isEn ? 'New PIN and Confirm PIN do not match.' : 'नया पिन और पुष्टि पिन आपस में मेल नहीं खा रहे हैं।',
        isError: true,
      });
      return;
    }

    const res = await changeAdminPin(oldPin, newPin);
    if (res.success) {
      setChangePinMsg({
        text: isEn ? 'Secret PIN updated successfully! Only you can log in now.' : 'गुप्त पिन सफलतापूर्वक बदल गया! अब केवल आप नए पिन से लॉगिन कर सकते हैं।',
        isError: false,
      });
      setOldPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setIsChangingPin(false);
        setChangePinMsg(null);
      }, 1800);
    } else {
      setChangePinMsg({
        text: res.message || (isEn ? 'Current PIN is incorrect.' : 'वर्तमान सुरक्षा पिन गलत है।'),
        isError: true,
      });
    }
  };

  const villageTitle = isEn
    ? (profile.villageNameEn || profile.villageName)
    : profile.villageName;

  return (
    <div className="max-w-md mx-auto my-8 sm:my-14 p-4 sm:p-0 animate-in fade-in zoom-in-95 duration-200">
      <div className={`bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden ${shake ? 'animate-bounce' : ''}`}>
        {/* Top Header */}
        <div className="bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 text-white p-6 sm:p-8 text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-serif font-black text-2xl mb-3">
            <Lock className="w-8 h-8 text-stone-950 stroke-[2.2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {isEn ? 'Panchayat Admin Lock' : 'प्रशासनिक नियंत्रण कक्ष'}
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            {villageTitle} · {isEn ? 'Authorized Personnel Login' : 'अधिकृत कार्मिक लॉगिन'}
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEn ? 'Confidential Security Lock' : 'गोपनीय सुरक्षा लॉक'}</span>
          </div>
        </div>

        {/* PIN Entry Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {!isChangingPin ? (
            <div className="text-center">
              <label htmlFor="admin-security-pin-input" className="text-xs font-semibold text-stone-600 block mb-2 uppercase tracking-wider">
                {t('enterPin')}
              </label>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="relative max-w-xs mx-auto">
                  <input
                    id="admin-security-pin-input"
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setErrorMsg(null);
                    }}
                    autoFocus
                    placeholder="••••"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono font-bold bg-stone-50 border-2 border-stone-300 focus:border-emerald-600 rounded-2xl py-3 px-10 text-stone-900 focus:outline-none transition-all shadow-inner"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700"
                    title={showPin ? (isEn ? 'Hide PIN' : 'पिन छिपाएं') : (isEn ? 'Show PIN' : 'पिन देखें')}
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center justify-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Touch Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-900 font-bold text-lg font-mono transition-all border border-stone-200 shadow-2xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPinInput('')}
                    className="py-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-semibold"
                  >
                    {isEn ? 'Clear' : 'साफ करें'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-900 font-bold text-lg font-mono transition-all border border-stone-200"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="py-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-sm font-semibold"
                  >
                    ⌫
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isVerifying ? (isEn ? 'Verifying...' : 'सत्यापित हो रहा है...') : t('verifyPinBtn')}</span>
                </button>
              </form>

              {/* Secret Change PIN Toggle */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPin(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-emerald-900 hover:underline font-medium"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Change Secret PIN' : 'सुरक्षा पासवर्ड / पिन बदलें'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Change PIN Sub-form */
            <div className="space-y-4">
              <div className="text-center border-b border-stone-100 pb-3">
                <h3 className="font-bold text-sm text-stone-900">
                  {isEn ? 'Change Secret Admin PIN' : 'गुप्त एडमिन पिन बदलें'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isEn ? 'Set your own secret PIN so only you can access' : 'अपनी पसंद का नया पिन सेट करें ताकि कोई दूसरा न खोल सके'}
                </p>
              </div>

              {changePinMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold ${
                    changePinMsg.isError
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  }`}
                >
                  {changePinMsg.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSecretPins(!showSecretPins)}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium cursor-pointer"
                >
                  {showSecretPins ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-stone-400" />}
                  <span>{showSecretPins ? (isEn ? 'Hide' : 'छिपाएं') : (isEn ? 'Show' : 'देखें')}</span>
                </button>
              </div>

              <form onSubmit={handleSecretPinChange} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Current PIN:' : 'वर्तमान पिन:'}
                  </label>
                  <input
                    type={showSecretPins ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-center tracking-[0.3em] text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'New Secret PIN (4-6 digits):' : 'नया गुप्त पिन (4-6 अंक):'}
                  </label>
                  <input
                    type={showSecretPins ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-center tracking-[0.3em] text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    {isEn ? 'Confirm New PIN:' : 'नए पिन की पुष्टि करें:'}
                  </label>
                  <input
                    type={showSecretPins ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 font-mono text-center tracking-[0.3em] text-lg text-stone-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPin(false);
                      setChangePinMsg(null);
                    }}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-medium cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'रद्द करें'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    {isEn ? 'Save Secret PIN' : 'नया पिन सुरक्षित करें'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Back to Citizen Portal */}
          <div className="pt-2 text-center border-t border-stone-100">
            <button
              onClick={() => setViewMode('gramin')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToGramin')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
