
export type Language = "id" | "en";

export interface TranslationDict {
  splash: {
    weddingInvitation: string;
    openInvitation: string;
    findInvitation: string;
    phonePlaceholder: string;
    searchButton: string;
    notFound: string;
  };
  hero: {
    weddingInvitationOf: string;
    saveTheDate: string;
  };
  couple: {
    title: string;
    intro: string;
    requestRestu: string;
    groomLabel: string;
    brideLabel: string;
  };
  event: {
    sectionLabel: string;
    title: string;
    weddingCeremony: string;
    weddingReception: string;
    addToCalendar: string;
    viewMap: string;
    decorativeTitle: string;
  };
  rsvp: {
    title: string;
    subtitle: string;
    willYouAttend: string;
    yesAttend: string;
    noAttend: string;
    numberOfGuests: string;
    sendRSVP: string;
    successMessage: string;
    errorMessage: string;
  };
  gift: {
    sectionLabel: string;
    title: string;
    description: string;
    copyAccount: string;
    accountCopied: string;
    warningNote: string;
  };
  guestbook: {
    sectionLabel: string;
    title: string;
    description: string;
    showingWishes: string;
    yourName: string;
    message: string;
    placeholderName: string;
    placeholderMessage: string;
    sendButton: string;
    loading: string;
    empty: string;
    restrictedTitle: string;
    restrictedDesc: string;
  };
  footer: {
    closing: string;
    seeYou: string;
  };
  story: {
    title: string;
    intro: string;
  };
  gallery: {
    title: string;
    description: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  id: {
    splash: {
      weddingInvitation: "Undangan Pernikahan",
      openInvitation: "Buka Undangan",
      findInvitation: "Cari Undangan",
      phonePlaceholder: "Contoh: 628...",
      searchButton: "Cari",
      notFound: "Maaf, nomor tidak terdaftar",
    },
    hero: {
      weddingInvitationOf: "Undangan Pernikahan",
      saveTheDate: "Simpan Tanggalnya",
    },
    couple: {
      title: "Profil Kami",
      intro: "Dari setiap langkah yang membawa kami ke berbagai arah,\nkami menemukan satu sama lain sebagai tempat untuk pulang.",
      requestRestu: "Dengan mengharap ridho Allah SWT, kami memohon restu dan kehadiran Anda pada hari bahagia kami:",
      groomLabel: "Mempelai Pria",
      brideLabel: "Mempelai Wanita",
    },
    event: {
      sectionLabel: "وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
      title: "Dan segala sesuatu Kami ciptakan berpasang-pasangan, agar kamu mengingat kebesaran Allah. (QS. Az-Zariyat: 49)",
      weddingCeremony: "Akad Nikah",
      weddingReception: "Resepsi Pernikahan",
      addToCalendar: "Tambah ke Kalender",
      viewMap: "Buka Lokasi",
      decorativeTitle: "Momen Bahagia",
    },
    rsvp: {
      title: "Konfirmasi Kehadiran",
      subtitle: "Mohon konfirmasi kehadiran Anda melalui formulir di bawah ini",
      willYouAttend: "Apakah Anda akan hadir?",
      yesAttend: "Ya, Saya Datang",
      noAttend: "Maaf, Tidak Bisa",
      numberOfGuests: "Jumlah Tamu",
      sendRSVP: "Kirim Konfirmasi",
      successMessage: "Terima kasih atas konfirmasi Anda!",
      errorMessage: "Gagal mengirim konfirmasi. Silakan coba lagi.",
    },
    gift: {
      sectionLabel: "Tanda Kasih",
      title: "Wedding Gift",
      description: "Bagi yang ingin memberikan tanda kasih, dapat mengirimkan melalui fitur di bawah ini:",
      copyAccount: "Salin Rekening",
      accountCopied: "Rekening Berhasil Disalin!",
      warningNote: "Tanpa mengurangi rasa hormat, mohon maaf kami tidak menerima tamu di rumah.",
    },
    guestbook: {
      sectionLabel: "Kirim Doa",
      title: "Doa & Ucapan",
      description: "Dengan sepenuh hati, kami mengundang Anda untuk menitipkan doa tulus dan harapan indah bagi kami dan keluarga tercinta.",
      showingWishes: "Terdapat {count} Doa & Ucapan Tulus",
      yourName: "Nama Anda",
      message: "Pesan / Doa",
      placeholderName: "Nama Anda",
      placeholderMessage: "Tuliskan doa dan ucapan manis Anda di sini...",
      sendButton: "Kirim Doa & Ucapan",
      loading: "Memuat ucapan...",
      empty: "Belum ada ucapan. Jadilah yang pertama!",
      restrictedTitle: "Tautan Terbatas",
      restrictedDesc: "Silakan gunakan tautan undangan unik Anda untuk dapat mengirimkan ucapan doa.",
    },
    gallery: {
      title: "Momen Bahagia",
      description: "Momen-momen berharga yang berhasil kami abadikan dalam bidikan kamera.",
    },
    footer: {
      closing: "Akan menjadi kebahagiaan bagi kami apabila Anda berkenan hadir di hari pernikahan kami. Terima kasih atas doa, ucapan baik, dan perhatian yang diberikan.",
      seeYou: "Sampai jumpa di hari bahagia kami.",
    },
    story: {
      title: "Cerita Kami",
      intro: "Catatan kecil dari perjalanan yang membawa kami pada titik ini.",
    },
  },
  en: {
    splash: {
      weddingInvitation: "Wedding Invitation",
      openInvitation: "Open Invitation",
      findInvitation: "Find My Invitation",
      phonePlaceholder: "Example: 628...",
      searchButton: "Search",
      notFound: "Sorry, number not found",
    },
    hero: {
      weddingInvitationOf: "The Wedding Invitation of",
      saveTheDate: "Save The Date",
    },
    couple: {
      title: "Our Profiles",
      intro: "From every step that brought us in different directions,\nwe found each other as a place to come home.",
      requestRestu: "With the blessing of God, we request your presence and prayers on our special day",
      groomLabel: "The Groom",
      brideLabel: "The Bride",
    },
    event: {
      sectionLabel: "وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
      title: "And of all things We created two mates; perhaps you will remember. (QS. Az-Zariyat: 49)",
      weddingCeremony: "Holy Matrimony",
      weddingReception: "Wedding Reception",
      addToCalendar: "Add to Calendar",
      viewMap: "Open Location",
      decorativeTitle: "The Celebration",
    },
    rsvp: {
      title: "RSVP Confirmation",
      subtitle: "Please confirm your presence through the form below:",
      willYouAttend: "Will you attend?",
      yesAttend: "Yes, I'll be there",
      noAttend: "Sorry, I can't",
      numberOfGuests: "Number of Guests",
      sendRSVP: "Send Confirmation",
      successMessage: "Thank you for your confirmation!",
      errorMessage: "Failed to send confirmation. Please try again.",
    },
    gift: {
      sectionLabel: "Wedding Gift",
      title: "Tanda Kasih",
      description: "For those who wish to send a wedding gift, you can use the features below:",
      copyAccount: "Copy Account",
      accountCopied: "Account Number Copied!",
      warningNote: "With all due respect, we apologize as we are not accepting guests at home.",
    },
    guestbook: {
      sectionLabel: "Send Wishes",
      title: "Wishes & Greeting",
      description: "With all our hearts, we invite you to leave your sincere prayers and beautiful hopes for us and our beloved family.",
      showingWishes: "Showing {count} Heartfelt Wishes",
      yourName: "Your Name",
      message: "Message / Wish",
      placeholderName: "Your Name",
      placeholderMessage: "Write your sincere wishes and sweet greetings here...",
      sendButton: "Send Wishes",
      loading: "Loading wishes...",
      empty: "No wishes yet. Be the first!",
      restrictedTitle: "Access Restricted",
      restrictedDesc: "Please use your unique invitation link to send wishes to the couple.",
    },
    gallery: {
      title: "Captured Moments",
      description: "Precious moments we've captured through the lens of our camera.",
    },
    footer: {
      closing: "It would be an absolute joy for us if you could be present on our wedding day. Thank you for the prayers, kind words, and the attention given.",
      seeYou: "See you on our happy day.",
    },
    story: {
      title: "Our Story",
      intro: "A collection of moments that lead us to where we are today.",
    },
  },
};
