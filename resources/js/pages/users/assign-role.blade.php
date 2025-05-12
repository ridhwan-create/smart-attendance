<x-app-layout>
    <x-slot name="header">
        <h2 class="text-xl font-semibold leading-tight">Assign Role</h2>
    </x-slot>

    <div class="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <form method="POST" action="{{ route('users.assign-role.update', $user) }}">
            @csrf

            {{-- <div class="mb-4">
                <x-input-label for="role" :value="'Pilih Role'" />
                <select name="role" id="role" class="border-gray-300 focus:ring focus:ring-indigo-200 w-full">
                    @foreach ($roles as $id => $name)
                        <option value="{{ $id }}" {{ $user->hasRole($name) ? 'selected' : '' }}>
                            {{ $name }}
                        </option>
                    @endforeach
                </select>
            </div> --}}

            <div class="mb-4">
                <x-input-label value="Pilih Role" />
            
                @foreach ($roles as $id => $name)
                    <label class="inline-flex items-center">
                        <input type="checkbox" name="roles[]" value="{{ $id }}" 
                            class="form-checkbox"
                            {{ in_array($id, $user->roles->pluck('id')->toArray()) ? 'checked' : '' }}>
                        <span class="ml-2">{{ $name }}</span>
                    </label><br>
                @endforeach
            
                @error('roles') 
                    <span class="text-red-500 text-sm">{{ $message }}</span> 
                @enderror
            </div>
            

            <x-primary-button>Assign Role</x-primary-button>
        </form>
    </div>
</x-app-layout>
