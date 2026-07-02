import Link from "next/link";

export default function EditPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            编辑页面
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            这是一个编辑页面示例。你可以在这里添加表单或其他编辑功能。
          </p>
        </div>

        <div className="w-full max-w-md mt-8">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                标题
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="输入标题"
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="content"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                内容
              </label>
              <textarea
                id="content"
                name="content"
                rows={5}
                placeholder="输入内容"
                className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
              >
                保存
              </button>
              <Link
                href="/"
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-8 text-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                返回首页
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
