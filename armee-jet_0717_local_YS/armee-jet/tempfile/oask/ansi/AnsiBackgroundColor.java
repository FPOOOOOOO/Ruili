package abc.ney.armee.jet.utils.ansi;

import lombok.Getter;

/**
 * See https://en.wikipedia.org/wiki/ANSI_escape_code#3/4_bit
 * <p>
 * Copied from org.springframework.boot.ansi.AnsiBackground
 *
 * @author Phillip Webb
 * @author Geoffrey Chandler
 */
@Getter
public enum AnsiBackgroundColor implements AnsiEscapeCode {
    BLACK("40"),
    RED("41"),
    GREEN("42"),
    YELLOW("43"),
    BLUE("44"),
    MAGENTA("45"),
    CYAN("46"),
    WHITE("47"),

    BRIGHT_BLACK("100"),
    BRIGHT_RED("101"),
    BRIGHT_GREEN("102"),
    BRIGHT_YELLOW("103"),
    BRIGHT_BLUE("104"),
    BRIGHT_MAGENTA("105"),
    BRIGHT_CYAN("106"),
    BRIGHT_WHITE("107"),

    DEFAULT_BACKGROUND_COLOR("49"),
    ;

    private String ansiCode;

    AnsiBackgroundColor(String code) {
        this.ansiCode = code;
    }
}
