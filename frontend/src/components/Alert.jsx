import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Alert = ({ type = 'success', message, onClose }) => {
  const isSuccess = type === 'success';

  const bgColor = isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const iconBgColor = isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600';
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div className={`flex items-start gap-4 ${bgColor} border rounded-lg p-4 backdrop-blur-sm`}>
      <div className={`${iconBgColor} rounded-full p-2 flex-shrink-0`}>
        <Icon size={20} />
      </div>
      <p className={`flex-1 ${textColor} font-medium`}>{message}</p>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 transition flex-shrink-0`}
      >
        <X size={20} />
      </button>
    </div>
  );
};
