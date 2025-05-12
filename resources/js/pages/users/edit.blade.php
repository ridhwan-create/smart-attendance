<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight">Kemaskini Pengguna</h2>
    </x-slot>

    <div class="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        
        @if (session('success'))
            <div class="mb-4 p-3 bg-green-500 text-white rounded">
                {{ session('success') }}
            </div>
        @endif

        <form method="POST" action="{{ route('users.update', $user->id) }}">
            @csrf
            @method('PUT')

            <!-- 📌 Container Maklumat Pengguna -->
            <div class="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                <h3 class="text-lg font-semibold mb-4">👤 Maklumat Pengguna</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <x-input-label for="name" value="Nama" />
                        <x-text-input id="name" class="block mt-1 w-full" type="text" name="name" value="{{ old('name', $user->name) }}" required autofocus 
                            oninput="this.value = this.value.toUpperCase()" />                    
                        @error('name') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <x-input-label for="email" value="Email" />
                        <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" value="{{ old('email', $user->email) }}" required />
                        @error('email') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <x-input-label for="password" value="Kata Laluan (Biarkan kosong jika tidak mahu ubah)" />
                        <x-text-input id="password" class="block mt-1 w-full" type="password" name="password" />
                        @error('password') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>

                    <div>
                        <x-input-label for="password_confirmation" value="Sahkan Kata Laluan" />
                        <x-text-input id="password_confirmation" class="block mt-1 w-full" type="password" name="password_confirmation" />
                        @error('password_confirmation') <span class="text-red-500 text-sm">{{ $message }}</span> @enderror
                    </div>
                </div>
            </div>

            <!-- 📌 Container Maklumat Peranan -->
            <div class="mb-6 p-4 border border-gray-300 rounded-lg shadow-sm">
                <h3 class="text-lg font-semibold mb-4">🔑 Maklumat Peranan</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    @foreach($roles as $id => $name)
                        <label class="inline-flex items-center">
                            <input type="checkbox" name="roles[]" value="{{ $id }}" 
                                class="form-checkbox"
                                {{ in_array($id, $user->roles->pluck('id')->toArray()) ? 'checked' : '' }}>
                            <span class="ml-2">{{ $name }}</span>
                        </label>
                    @endforeach
                </div>

                @error('roles') 
                    <span class="text-red-500 text-sm">{{ $message }}</span> 
                @enderror
            </div>

            <!-- 📌 Butang Hantar & Kembali -->
            <div class="flex justify-between">
                <a href="{{ route('users.index') }}" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
                    ⬅️ Kembali
                </a>

                <x-primary-button class="px-6 py-2">💾 Simpan</x-primary-button>
            </div>

        </form>
    </div>
</x-app-layout>
