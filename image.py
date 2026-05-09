from pathlib import Path

folder = Path(r"images")

extensions = {".jpg", ".jpeg", ".png", ".webp"}

files = sorted(
    [f for f in folder.iterdir() if f.suffix.lower() in extensions]
)

for index, file in enumerate(files, start=1):

    new_name = f"{index}{file.suffix.lower()}"

    new_path = folder / new_name

    file.rename(new_path)

    print(f"{file.name} -> {new_name}")

print("Done.")
