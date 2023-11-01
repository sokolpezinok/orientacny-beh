from bs4 import BeautifulSoup as Soup

manifest = "./android/app/src/main/AndroidManifest.xml"

with open(manifest, "r") as file:
	soup = Soup(file.read(), "xml")

# wrap with a manifest tag to preserve android: namespace
data = Soup("""
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
<intent-filter android:autoVerify="true">
	<action android:name="android.intent.action.VIEW" />
	<category android:name="android.intent.category.DEFAULT" />
	<category android:name="android.intent.category.BROWSABLE" />
	<data android:scheme="https" android:host="members.eob.cz" />
</intent-filter>
</manifest>
""", "xml")

soup.manifest.activity.append(data.find("intent-filter"))

print(f"Inserting <intent-filter> to {manifest} ...")

with open(manifest, "w") as file:
	file.write(soup.prettify())
