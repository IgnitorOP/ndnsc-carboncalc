# NDNSC Carbon Calculator: how to put it online
Target address: https://ndnsc-carboncalc.vercel.app

This folder already has everything needed. Do not rename or move anything.

    index.html      the website
    api/count.js    the live "people who calculated" counter
    README.md       this guide

## Step 1. Upload the files to GitHub (about 3 minutes)
1. Go to https://github.com and sign up or log in.
2. Click **+** (top right), then **New repository**.
3. Repository name: `ndnsc-carboncalc`. Choose **Public**. Click **Create repository**.
4. Click the link **uploading an existing file**.
5. Open this folder on your computer, select everything inside it
   (`index.html`, the `api` folder, `README.md`) and drag it into the page.
   Drag the contents, not the folder itself.
6. Click **Commit changes**.
7. Check: the repository page shows `index.html` and an `api` folder.

## Step 2. Publish on Vercel (about 2 minutes)
1. Go to https://vercel.com and click **Sign Up**, then **Continue with GitHub**.
   Choose the free **Hobby** plan.
2. Click **Add New…**, then **Project**.
3. Find `ndnsc-carboncalc` and click **Import**.
   (Not listed? Click **Adjust GitHub App Permissions** and allow it.)
4. **Project Name** must be `ndnsc-carboncalc`. Leave everything else as it is.
5. Click **Deploy** and wait about a minute.
6. Open https://ndnsc-carboncalc.vercel.app and the website is live.

## Step 3. Turn on the live user counter (about 2 minutes)
1. In your project on Vercel, open the **Storage** tab.
2. Choose **Upstash** (Redis), then the **Free** plan.
   Region: **Singapore** or **Mumbai**. Create it.
3. When asked, connect it to the `ndnsc-carboncalc` project (all environments).
4. Go to **Deployments**, click **⋯** next to the newest one, then **Redeploy**.
5. Check: open https://ndnsc-carboncalc.vercel.app/api/count
   It should show `{"count":0}`. The counter card now appears in the footer
   and goes up when someone calculates.

## Updating the website later
1. On GitHub, open the repository and click **Add file**, then **Upload files**.
2. Drop in the new `index.html` and click **Commit changes**.
3. Vercel updates the live site by itself within a minute.

## If something goes wrong
* **The address has extra letters** (like `ndnsc-carboncalc-abc123.vercel.app`):
  the name was taken. In Vercel open **Settings**, then **Domains**, and add
  `ndnsc-carboncalc.vercel.app`. If it is unavailable, pick a close name.
* **/api/count shows `storage_not_configured`**: Step 3 is not finished, or you
  did not press Redeploy.
* **The counter card doesn't show**: same as above; the rest of the site works
  normally without it.
* **The 404 page appears**: the files were uploaded inside an extra folder.
  `index.html` must be at the top of the repository.

## About the counter
* Counts each browser once, even if the person calculates again.
* Each internet address can add at most 30 per day (stops fake inflation).
  Raise `PER_IP_DAILY_LIMIT` in `api/count.js` for big events on shared Wi-Fi.
* Stores no names or answers: only the total, plus a scrambled code of the
  address that is deleted after 24 hours.
* Open pages refresh the number once a minute.
* To reset the count: in the Upstash console, delete the key `ndnsc:calculations`.

---

# বাংলায় সংক্ষেপে
১. github.com-এ নতুন repository খুলুন (নাম: `ndnsc-carboncalc`), এই ফোল্ডারের ভেতরের সব ফাইল আপলোড করে **Commit changes** চাপুন।
২. vercel.com-এ GitHub দিয়ে সাইন আপ করুন → **Add New → Project** → repository **Import** → Project Name `ndnsc-carboncalc` → **Deploy**।
৩. Vercel-এ **Storage** → **Upstash** (Free, Singapore/Mumbai) → প্রজেক্টে যুক্ত করুন → **Deployments** থেকে **Redeploy**।
৪. যাচাই: https://ndnsc-carboncalc.vercel.app/api/count খুললে `{"count":0}` দেখাবে।
পরে সাইট আপডেট করতে GitHub-এ নতুন `index.html` আপলোড করলেই হবে।
