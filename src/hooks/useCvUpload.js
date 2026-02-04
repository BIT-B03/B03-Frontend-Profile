import { useCallback, useRef, useState } from 'react';

const IsPdfFile = (file) => {
  if (!file) return false;
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};
const useCvUpload = ({ value, onChange, onError } = {}) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const ClearNativeInput = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const SetFile = useCallback((file) => {
    onChange?.(file);
  }, [onChange]);

  const ValidateAndSet = useCallback((file, { clearInputOnError = false } = {}) => {
    if (!file) {
      SetFile(null);
      return;
    }

    if (!IsPdfFile(file)) {
      onError?.('CV harus berupa file PDF.');
      if (clearInputOnError) ClearNativeInput();
      SetFile(null);
      return;
    }

    onError?.('');
    SetFile(file);
  }, [ClearNativeInput, SetFile, onError]);

  const HandleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0];
    ValidateAndSet(file, { clearInputOnError: true });
  }, [ValidateAndSet]);

  const HandleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    ValidateAndSet(file);
  }, [ValidateAndSet]);

  const HandleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const HandleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const OpenFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const RemoveFile = useCallback(() => {
    SetFile(null);
    ClearNativeInput();
  }, [ClearNativeInput, SetFile]);

  return {
    cvFile: value ?? null,
    dragActive,
    fileInputRef,
    HandleFileChange,
    HandleDrop,
    HandleDragOver,
    HandleDragLeave,
    OpenFileDialog,
    RemoveFile,
  };
};

export default useCvUpload;
