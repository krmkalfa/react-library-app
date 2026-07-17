import React from 'react';
import { useAuth } from '../../context/AuthContext';
import PublicHomepage from './PublicHomepage';
import MemberHomepage from './MemberHomepage';

export default function HomeWrapper() {
  const { user } = useAuth();
  
  // Sadece 'member' rolü için özel ana sayfayı göster
  if (user && user.role === 'member') {
    return <MemberHomepage />;
  }
  
  // Ziyaretçiler ve Yöneticiler (Admin) için genel tanıtım sayfasını göster
  return <PublicHomepage />;
}
