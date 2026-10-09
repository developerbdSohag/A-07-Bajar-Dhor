export default function Footer() {
  return (
    <footer className="mt-12 border-t border-base-300 bg-base-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:text-base text-base-content/75 sm:flex-row text-center sm:text-left">
        <p className="font-semibold text-base-content/85">বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
        <p className="italic">
          &ldquo;সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।&rdquo;
        </p>
      </div>
    </footer>
  );
}
