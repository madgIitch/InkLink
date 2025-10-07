# Firestore Schema – InkLink (versión inicial)

## artists

Guarda la información de cada tatuador.

- name: string
- city: string
- styles: string[]
- lat: number
- lng: number
- rating: number

## users

Guarda los datos básicos de los usuarios.

- name: string
- email: string
- role: string ("client" | "artist")
- favorites: string[] (IDs de artistas)
