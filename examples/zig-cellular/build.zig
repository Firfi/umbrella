const std = @import("std");

pub fn build(b: *std.Build) void {
    // IMPORTANT: Due to being part of this monorepo, this version of the build file is
    // slighty more complicated than needed...
    //
    // Please consult the thi.ng/wasm-api README for details!
    // Outside the umbrella monorepo, the import path for that file will be (usually):
    // node_modules/@thi.ng/wasm-api/zig/build.zig
    b.installArtifact(@import("wasm-api-build.zig").wasmLib(b, .{
        // Only needed for this monorepo!!
        .base = "../../node_modules",
        // Declare extra WASM API packages to use
        .modules = &.{
            .{ .name = "wasm-api-canvas", .path = "@thi.ng/wasm-api-canvas/zig/lib.zig" },
            .{ .name = "wasm-api-dom", .path = "@thi.ng/wasm-api-dom/zig/lib.zig" },
        },
        // build mode override
        .optimize = .ReleaseSmall,
    }));
}
